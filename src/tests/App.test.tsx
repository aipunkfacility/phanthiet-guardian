import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

vi.mock('../hooks/useTempleData', () => ({
  useTempleData: () => ({
    temples: [],
    addTemple: vi.fn(),
    updateTemple: vi.fn(),
    deleteTemple: vi.fn(),
  }),
}));

vi.mock('../hooks/useAdmin', () => ({
  useAdmin: () => ({
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Базовый рендеринг', () => {
    it('должен рендерить заголовок', () => {
      render(<App />);
      expect(screen.getByText('Phan Thiết: Путь Хранителя')).toBeInTheDocument();
    });

    it('должен рендерить навигацию', () => {
      render(<App />);
      // Используем getAllByText так как элемент встречается несколько раз
      const navButtons = screen.getAllByText('Храмы Фантьета');
      expect(navButtons.length).toBeGreaterThan(0);
    });

    it('должен рендерить кнопку Login', () => {
      render(<App />);
      const loginButtons = screen.getAllByText('Login');
      expect(loginButtons.length).toBeGreaterThan(0);
    });

    it('должен рендерить кнопку Экскурсия', () => {
      render(<App />);
      expect(screen.getByText('Экскурсия')).toBeInTheDocument();
    });

    it('должен рендерить кнопку AI-гида', () => {
      render(<App />);
      expect(screen.getByText('💬')).toBeInTheDocument();
    });
  });

  describe('Навигация', () => {
    it('должен скроллить к началу при клике на логотип', () => {
      render(<App />);
      const logos = screen.getAllByText('Храмы Фантьета');
      fireEvent.click(logos[0]);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('должен открывать Google Maps при клике на маршрут', () => {
      render(<App />);
      const routeButton = screen.getByText('Маршрут');
      fireEvent.click(routeButton);
      expect(window.open).toHaveBeenCalled();
    });
  });

  describe('Админ-панель', () => {
    it('должен открывать диалог логина', () => {
      render(<App />);
      const loginButtons = screen.getAllByText('Login');
      fireEvent.click(loginButtons[0]);
      expect(screen.getByText('Admin Mode')).toBeInTheDocument();
    });

    it('должен показывать ошибку при неверном пароле', async () => {
      render(<App />);
      const loginButtons = screen.getAllByText('Login');
      fireEvent.click(loginButtons[0]);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      const submitButtons = screen.getAllByText('Login');
      fireEvent.click(submitButtons[1]); // Вторая кнопка - в диалоге

      await waitFor(() => {
        expect(screen.getByText('Invalid password')).toBeInTheDocument();
      });
    });

    it('должен входить в админ-режим при правильном пароле', async () => {
      render(<App />);
      const loginButtons = screen.getAllByText('Login');
      fireEvent.click(loginButtons[0]);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButtons = screen.getAllByText('Login');
      fireEvent.click(submitButtons[1]);

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });
    });
  });
});
