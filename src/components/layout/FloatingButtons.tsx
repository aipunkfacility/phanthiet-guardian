import { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { MessageCircle, ArrowUp } from 'lucide-react';

interface FloatingButtonsProps {
  onOpenChat: () => void;
}

export function FloatingButtons({ onOpenChat }: FloatingButtonsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {showScrollTop && (
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full shadow-lg"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      <Button
        size="icon"
        className="rounded-full shadow-lg"
        onClick={onOpenChat}
        aria-label="Open chat"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  );
}
