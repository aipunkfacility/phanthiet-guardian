import { useAudioPlayer } from '@/hooks/useAudio';

interface AudioGuidePlayerProps {
  text: string;
  title: string;
}

const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({ text, title }) => {
  const { 
    playText, 
    togglePlayback, 
    error,
    isPlaying, 
    isLoading 
  } = useAudioPlayer();

  const handleClick = async () => {
    if (isPlaying) {
      togglePlayback();
    } else {
      await playText(text);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl group hover:bg-white/10 transition-all">
      <button 
        onClick={handleClick}
        disabled={isLoading}
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isPlaying ? 'bg-orange-600' : 'bg-white text-stone-900'
        } ${isLoading ? 'animate-pulse opacity-50' : 'hover:scale-110 shadow-lg'}`}
      >
        {isLoading ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : isPlaying ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white truncate">{title}</h4>
        <p className="text-stone-400 text-xs uppercase tracking-widest mt-0.5">
          {isPlaying ? 'Сейчас играет...' : isLoading ? 'Настраиваемся на историю...' : 'Доступен аудиогид'}
        </p>
      </div>
      {error && <span className="text-red-400 text-[10px]">{error.message}</span>}
    </div>
  );
};

export default AudioGuidePlayer;
