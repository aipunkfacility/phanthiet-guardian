import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('import.meta.env', () => ({
  env: {
    VITE_GEMINI_API_KEY: 'test-api-key',
  },
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createBufferSource: vi.fn(),
    createBuffer: vi.fn(),
    destination: {},
    currentTime: 0,
  })),
});
