import { vi } from 'vitest';

export const mockGeminiService = {
  getGeminiGuideResponse: vi.fn(),
  generateAudio: vi.fn(),
};

export const mockDbService = {
  savePhotos: vi.fn(),
  getPhotos: vi.fn(),
  deletePhotos: vi.fn(),
  compressImage: vi.fn(),
  initDB: vi.fn(),
  migrateFromLocalStorage: vi.fn(),
};

export const mockImportExportService = {
  exportTemples: vi.fn(),
  importTemples: vi.fn(),
};
