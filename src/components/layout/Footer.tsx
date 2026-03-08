import { APP_CONFIG } from '@/constants';

interface FooterProps {
  isAdmin?: boolean;
  onAdminToggle?: () => void;
}

export function Footer({ isAdmin, onAdminToggle }: FooterProps) {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-12 px-6 text-center">
      <div className="max-w-lg mx-auto">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-lg font-semibold mb-4 text-stone-800 hover:text-orange-600 transition-colors cursor-pointer"
        >
          {APP_CONFIG.TITLE}
        </button>
        <p className="text-stone-500 text-sm mb-6">
          Интерактивный путеводитель по культурным местам города.
        </p>
        <button 
          onClick={onAdminToggle}
          className={`text-xs font-medium uppercase tracking-wider transition-colors ${isAdmin ? 'text-red-600' : 'text-stone-300 hover:text-stone-600'}`}
        >
          {isAdmin ? 'Выйти из admin' : 'Admin'}
        </button>
      </div>
    </footer>
  );
}
