export async function decodeWavBase64(
  base64: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioData = await audioContext.decodeAudioData(bytes.buffer);
    return audioData;
  } catch (error) {
    console.error('Failed to decode audio:', error);
    throw error;
  }
}

export function getAudioContext(): AudioContext {
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  return new AudioCtx();
}

export function playAudioBuffer(
  audioContext: AudioContext,
  buffer: AudioBuffer,
  startTime: number = 0
): AudioBufferSourceNode {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(startTime);
  return source;
}

export function stopAudioNode(node: AudioBufferSourceNode): void {
  node.stop();
}

export function isAudioContextSupported(): boolean {
  return !!(window.AudioContext || (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext);
}
