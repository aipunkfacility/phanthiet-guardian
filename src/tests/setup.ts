// src/tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Очистка после каждого теста
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Мок для IndexedDB
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDB,
  writable: true,
});

// Мок для AudioContext
class MockAudioContext {
  sampleRate = 24000;
  currentTime = 0;
  state = 'running';
  
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }));
  
  createBuffer = vi.fn((channels, length, sampleRate) => ({
    getChannelData: vi.fn(() => new Float32Array(length)),
    length,
    sampleRate,
    numberOfChannels: channels,
  }));
  
  destination = {};
  
  close = vi.fn();
  resume = vi.fn();
}

Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: MockAudioContext,
  writable: true,
});

// Мок для navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  },
  writable: true,
});

// Мок для URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Мок для ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  value: MockResizeObserver,
  writable: true,
});

// Мок для matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

// Мок для scrollTo
window.scrollTo = vi.fn();

// Мок для window.open
window.open = vi.fn();
