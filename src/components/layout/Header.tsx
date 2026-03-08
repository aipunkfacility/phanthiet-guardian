import { Button } from '@/ui/button';
import { APP_CONFIG } from '@/constants';
import { PlanContext } from '@/hooks/useSchedule';

interface HeaderProps {
  context: PlanContext;
  onStartRoute: () => void;
}

export function Header({ context, onStartRoute }: HeaderProps) {
  return (
    <header className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-center bg-stone-900 overflow-hidden pt-16 px-6 text-center">
      <img 
        src="/hero.jpg" 
        className="absolute inset-0 w-full h-full object-cover opacity-40" 
        alt="Phan Thiet" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-stone-900/30"></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <span className="text-orange-500 font-semibold uppercase tracking-[0.3em] text-xs md:text-sm mb-6">Phan Thiết</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white">
          {APP_CONFIG.TITLE}
        </h1>
        <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-lg mx-auto leading-relaxed">
          {context.desc}
        </p>
        <Button 
          onClick={onStartRoute}
          size="lg"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-colors cursor-pointer"
        >
          Начать маршрут
        </Button>
      </div>
    </header>
  );
}
