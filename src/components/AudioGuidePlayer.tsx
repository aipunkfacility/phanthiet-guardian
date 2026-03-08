
import React, { useState, useRef } from 'react';
import { generateAudio } from '../services/gemini';

interface AudioGuidePlayerProps {
  text: string;
  title: string;
}

const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({ text, title }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

   const handlePlay = async () => {
     if (status === 'playing') {
       sourceRef.current?.stop();
       offsetRef.current += audioContextRef.current!.currentTime - startTimeRef.current;
       setStatus('paused');
       return;
     }

     if (status === 'paused' && audioBufferRef.current) {
       playBuffer(audioBufferRef.current, offsetRef.current);
       return;
     }

     setStatus('loading');
     setError(null);

     try {
       const base64 = await generateAudio(text);
       if (!base64) {
         setError('Ошибка генерации');
         setStatus('idle');
         return;
       }

       if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
       }

       const bytes = decode(base64);
       const buffer = await decodeAudioData(bytes, audioContextRef.current);
       audioBufferRef.current = buffer;
       playBuffer(buffer, 0);
     } catch (e) {
       setError('Ошибка обработки');
       setStatus('idle');
     }
   };

  const playBuffer = (buffer: AudioBuffer, offset: number) => {
    if (!audioContextRef.current) return;
    
    if (sourceRef.current) {
      sourceRef.current.stop();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      if (status === 'playing') {
        setStatus('idle');
        offsetRef.current = 0;
      }
    };

    startTimeRef.current = audioContextRef.current.currentTime;
    source.start(0, offset);
    sourceRef.current = source;
    setStatus('playing');
  };

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl group hover:bg-white/10 transition-all">
      <button 
        onClick={handlePlay}
        disabled={status === 'loading'}
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
          status === 'playing' ? 'bg-orange-600' : 'bg-white text-stone-900'
        } ${status === 'loading' ? 'animate-pulse opacity-50' : 'hover:scale-110 shadow-lg'}`}
      >
        {status === 'loading' ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : status === 'playing' ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
        ) : (
          <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white truncate">{title}</h4>
        <p className="text-stone-400 text-xs uppercase tracking-widest mt-0.5">
          {status === 'playing' ? 'Сейчас играет...' : status === 'loading' ? 'Настраиваемся на историю...' : 'Доступен аудиогид'}
        </p>
      </div>
      {error && <span className="text-red-400 text-[10px]">{error}</span>}
    </div>
  );
};

export default AudioGuidePlayer;
