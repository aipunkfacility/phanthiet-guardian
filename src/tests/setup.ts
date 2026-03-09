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
class MockIDBRequest {
  result: unknown = undefined;
  error: Error | null = null;
  onsuccess: (() => unknown) | null = null;
  onerror: (() => unknown) | null = null;
  
  constructor(_source: unknown, _transaction: unknown) {}
  
  setResult(value: unknown) {
    this.result = value;
    if (this.onsuccess) {
      this.onsuccess();
    }
  }
  
  setError(error: Error) {
    this.error = error;
    if (this.onerror) {
      this.onerror();
    }
  }
}

class MockIDBDatabase {
  objectStoreNames = { contains: () => false, length: 0 };
  close = vi.fn();
  createObjectStore = vi.fn(() => new MockIDBRequest(null, null));
}

const createIDBRequest = (result?: unknown): MockIDBRequest => {
  const request = new MockIDBRequest(null, null);
  if (result !== undefined) {
    request.setResult(result);
  }
  return request;
};

const indexedDB = {
  open: vi.fn((_name: string, _version?: number) => {
    const db = new MockIDBDatabase();
    return createIDBRequest(db);
  }),
  deleteDatabase: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDB,
  writable: true,
});

// Мок для AudioContext
class MockAudioBuffer {
  duration = 1;
  length = 24000;
  numberOfChannels = 1;
  sampleRate = 24000;
  channelData = [new Float32Array(24000)];
  
  getChannelData = (channel: number) => this.channelData[channel] || new Float32Array(24000);
}

class MockAudioContext {
  sampleRate = 24000;
  currentTime = 0;
  state = 'running';
  
  decodeAudioData = vi.fn(async (_audioData: ArrayBuffer) => {
    return new MockAudioBuffer();
  });
  
  createBufferSource = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }));
  
  createBuffer = vi.fn((channels: number, length: number, sampleRate: number) => ({
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
