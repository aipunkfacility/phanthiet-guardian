import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AudioGuidePlayer from '../components/AudioGuidePlayer';
import * as geminiModule from '../services/gemini';
import { mockAudioBase64 } from './mocks/data';

vi.mock('../services/gemini', () => ({
  generateAudio: vi.fn(),
}));

describe('AudioGuidePlayer', () => {
  const defaultProps = {
    text: 'Тестовый текст для озвучивания',
    title: 'Слушать Хранителя',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(geminiModule.generateAudio).mockResolvedValue(mockAudioBase64);
  });

  describe('Начальное состояние', () => {
    it('должен рендерить компонент с заголовком', () => {
      render(<AudioGuidePlayer {...defaultProps} />);
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('должен показывать статус "Доступен аудиогид"', () => {
      render(<AudioGuidePlayer {...defaultProps} />);
      expect(screen.getByText('Доступен аудиогид')).toBeInTheDocument();
    });

    it('должен показывать кнопку воспроизведения', () => {
      render(<AudioGuidePlayer {...defaultProps} />);
      const playButton = screen.getByRole('button');
      expect(playButton).toBeInTheDocument();
    });
  });

  describe('Воспроизведение аудио', () => {
    it('должен вызывать generateAudio при клике на кнопку', async () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(geminiModule.generateAudio).toHaveBeenCalledWith(defaultProps.text);
      });
    });

    it('должен показывать статус загрузки при нажатии', async () => {
      vi.mocked(geminiModule.generateAudio).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockAudioBase64), 1000))
      );

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Настраиваемся на историю...')).toBeInTheDocument();
      });
    });

    it('должен показывать статус воспроизведения после загрузки', async () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Сейчас играет...')).toBeInTheDocument();
      });
    });

    it('должен переключаться на паузу при повторном клике', async () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');

      // Начинаем воспроизведение
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Сейчас играет...')).toBeInTheDocument();
      });

      // Ставим на паузу
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Доступен аудиогид')).toBeInTheDocument();
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен показывать ошибку при null ответе от API', async () => {
      vi.mocked(geminiModule.generateAudio).mockResolvedValueOnce(null);

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Ошибка генерации')).toBeInTheDocument();
      });
    });

    it('должен возвращаться в начальное состояние после ошибки', async () => {
      vi.mocked(geminiModule.generateAudio).mockRejectedValueOnce(
        new Error('API Error')
      );

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Ошибка обработки')).toBeInTheDocument();
      });

      // Кнопка должна быть снова активна
      expect(playButton).not.toBeDisabled();
    });
  });

  describe('Состояние кнопки', () => {
    it('должен быть disabled во время загрузки', async () => {
      vi.mocked(geminiModule.generateAudio).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockAudioBase64), 1000))
      );

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(playButton).toBeDisabled();
      });
    });
  });
});
