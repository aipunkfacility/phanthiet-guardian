import { useState, useCallback, useRef, useEffect } from 'react';
import { generateAudio } from '@/services/gemini';
import { decodeWavBase64, getAudioContext, playAudioBuffer, stopAudioNode } from '@/utils/audioDecoder';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface UseAudioReturn {
  status: AudioStatus;
  play: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  error: Error | null;
}

export function useAudio(): UseAudioReturn {
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    bufferRef.current = null;
    pauseOffsetRef.current = 0;
    setStatus('idle');
  }, []);

  const play = useCallback(async (text: string) => {
    try {
      setStatus('loading');
      setError(null);

      // Stop any current playback
      if (sourceRef.current) {
        stopAudioNode(sourceRef.current);
        sourceRef.current = null;
      }

      // Initialize audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = getAudioContext();
      }

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Generate audio from text
      const audioBase64 = await generateAudio(text);
      
      if (!audioBase64) {
        throw new Error('Failed to generate audio');
      }

      // Remove data URL prefix if present
      const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      
      // Decode the audio
      const audioBuffer = await decodeWavBase64(base64Data, audioContextRef.current);
      bufferRef.current = audioBuffer;

      // Play the audio
      const source = playAudioBuffer(audioContextRef.current, audioBuffer);
      sourceRef.current = source;
      startTimeRef.current = audioContextRef.current.currentTime;
      pauseOffsetRef.current = 0;

      // Handle playback end
      source.onended = () => {
        setStatus('idle');
        sourceRef.current = null;
        pauseOffsetRef.current = 0;
      };

      setStatus('playing');
    } catch (err) {
      console.error('Audio playback error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('error');
    }
  }, []);

  const pause = useCallback(() => {
    if (sourceRef.current && audioContextRef.current && status === 'playing') {
      pauseOffsetRef.current += audioContextRef.current.currentTime - startTimeRef.current;
      stopAudioNode(sourceRef.current);
      sourceRef.current = null;
      setStatus('paused');
    }
  }, [status]);

  const resume = useCallback(async () => {
    if (!bufferRef.current || !audioContextRef.current || status !== 'paused') return;

    try {
      // Resume audio context if needed
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const source = playAudioBuffer(audioContextRef.current, bufferRef.current, pauseOffsetRef.current);
      sourceRef.current = source;
      startTimeRef.current = audioContextRef.current.currentTime;

      source.onended = () => {
        setStatus('idle');
        sourceRef.current = null;
        pauseOffsetRef.current = 0;
      };

      setStatus('playing');
    } catch (err) {
      console.error('Resume error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('error');
    }
  }, [status]);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      stopAudioNode(sourceRef.current);
      sourceRef.current = null;
    }
    pauseOffsetRef.current = 0;
    setStatus('idle');
  }, []);

  return {
    status,
    play,
    pause,
    resume,
    stop,
    error,
  };
}

export function useAudioPlayer() {
  const { status, play, pause, resume, stop, error } = useAudio();
  const [currentText, setCurrentText] = useState<string>('');

  const playText = useCallback(async (text: string) => {
    setCurrentText(text);
    await play(text);
  }, [play]);

  const togglePlayback = useCallback(async () => {
    if (status === 'playing') {
      pause();
    } else if (status === 'paused') {
      await resume();
    } else if (currentText) {
      await play(currentText);
    }
  }, [status, pause, resume, play, currentText]);

  return {
    status,
    currentText,
    playText,
    togglePlayback,
    stop,
    error,
    isPlaying: status === 'playing',
    isPaused: status === 'paused',
    isLoading: status === 'loading',
  };
}
