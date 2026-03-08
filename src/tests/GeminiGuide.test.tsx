import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GeminiGuide from '../components/GeminiGuide';
import * as geminiModule from '../services/gemini';
import { mockGeminiResponse } from './mocks/data';

vi.mock('../services/gemini', () => ({
  getGeminiGuideResponse: vi.fn(),
}));

describe('GeminiGuide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(geminiModule.getGeminiGuideResponse).mockResolvedValue(mockGeminiResponse);
  });

  describe('Начальное состояние', () => {
    it('должен рендерить кнопку открытия чата', () => {
      render(<GeminiGuide />);
      expect(screen.getByText('✨')).toBeInTheDocument();
    });

    it('должен быть закрыт по умолчанию', () => {
      render(<GeminiGuide />);
      expect(screen.queryByText('Хранитель историй')).not.toBeInTheDocument();
    });
  });

  describe('Открытие чата', () => {
    it('должен открывать чат при клике на кнопку', () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);
      expect(screen.getByText('Хранитель историй')).toBeInTheDocument();
    });

    it('должен показывать приветственное сообщение', () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);
      expect(screen.getByText(/Xin chào/)).toBeInTheDocument();
    });

    it('должен закрывать чат при клике на кнопку закрытия', () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Close chat');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Хранитель историй')).not.toBeInTheDocument();
    });
  });

  describe('Отправка сообщений', () => {
    it('должен отправлять сообщение при клике на кнопку отправки', async () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);

      const input = screen.getByPlaceholderText('Спросите о башнях...');
      fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(geminiModule.getGeminiGuideResponse).toHaveBeenCalledWith('Тестовый вопрос', expect.any(Array));
      });
    });

    it('должен отображать сообщение пользователя после отправки', async () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);

      const input = screen.getByPlaceholderText('Спросите о башнях...');
      fireEvent.change(input, { target: { value: 'Мой вопрос' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Мой вопрос')).toBeInTheDocument();
      });
    });

    it('должен отображать ответ бота после получения', async () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);

      const input = screen.getByPlaceholderText('Спросите о башнях...');
      fireEvent.change(input, { target: { value: 'Вопрос' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(mockGeminiResponse)).toBeInTheDocument();
      });
    });

    it('не должен отправлять пустые сообщения', async () => {
      render(<GeminiGuide />);
      const openButton = screen.getByLabelText('Open chat');
      fireEvent.click(openButton);

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      expect(geminiModule.getGeminiGuideResponse).not.toHaveBeenCalled();
    });
  });
});
