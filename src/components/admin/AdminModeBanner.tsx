import { Button } from '@/ui/button';
import { Shield } from 'lucide-react';

interface AdminModeBannerProps {
  onClick?: () => void;
}

export function AdminModeBanner({ onClick }: AdminModeBannerProps) {
  return (
    <div className="bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">Режим администратора</span>
      </div>
      {onClick && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClick}
          className="text-orange-700 dark:text-orange-300 hover:text-orange-900 dark:hover:text-orange-100"
        >
          Панель
        </Button>
      )}
    </div>
  );
}
