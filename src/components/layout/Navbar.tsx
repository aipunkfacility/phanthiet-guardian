import { Button } from '@/ui/button';
import { APP_CONFIG } from '@/constants';

interface NavbarProps {
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onAdminPanelClick?: () => void;
}

export function Navbar({ isAdmin, onLoginClick, onLogout, onAdminPanelClick }: NavbarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-stone-100 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm font-semibold tracking-tight text-stone-900 flex items-center gap-2 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
          Храмы Фантьета
        </button>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Button variant="outline" size="sm" onClick={onAdminPanelClick}>
                ⚙️ Admin
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={onLoginClick}>
              Login
            </Button>
          )}
          <Button asChild>
            <a href={APP_CONFIG.TRIPSTER_URL} target="_blank" rel="noopener noreferrer">
              Экскурсия
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
