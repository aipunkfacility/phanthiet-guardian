import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TempleCard } from '@/components/temple/TempleCard';
import { mockTemple } from '@/tests/mocks/data';

vi.mock('../../utils/db', () => ({
  savePhotos: vi.fn(),
  getPhotos: vi.fn().mockResolvedValue([]),
  compressImage: vi.fn().mockResolvedValue('base64-image'),
  migrateFromLocalStorage: vi.fn(),
  MAX_PHOTOS: 10,
}));

vi.mock('../../constants', () => ({
  TEMPLES: [mockTemple],
}));

describe('TempleCard', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Базовый рендеринг', () => {
    it('должен рендерить информацию о храме', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(mockTemple.name)).toBeInTheDocument();
      // Проверка наличия части текста описания
      expect(screen.getByText(/История тестового храма/i)).toBeInTheDocument();
    });

    it('должен рендерить изображение храма', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const image = screen.getByAltText(mockTemple.name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockTemple.imageUrl);
    });
  });

  describe('Закрытие карточки', () => {
    it('должен вызывать onClose при клике на кнопку закрытия', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Режим просмотра', () => {
    it('должен показывать кнопку копирования адреса', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Копировать')).toBeInTheDocument();
    });
  });
});
