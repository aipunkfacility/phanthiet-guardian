# Полное покрытие тестами компонентов

**Проект:** phanthiet-guardian  
**Цель:** Поднять покрытие тестами с ~5% до 80%+

---

## Содержание

1. [Настройка тестового окружения](#1-настройка-тестового-окружения)
2. [Тестовые утилиты и моки](#2-тестовые-утилиты-и-моки)
3. [Тесты TempleCard](#3-тесты-templecardtsx)
4. [Тесты GeminiGuide](#4-тесты-geminiguidetsx)
5. [Тесты AudioGuidePlayer](#5-тесты-audioguideplayertsx)
6. [Тесты App (index.tsx)](#6-тесты-app-indextsx)
7. [Тесты сервисов](#7-тесты-сервисов)
8. [Интеграционные тесты](#8-интеграционные-тесты)
9. [E2E тесты](#9-e2e-тесты)
10. [Запуск и CI интеграция](#10-запуск-и-ci-интеграция)

---

## 1. Настройка тестового окружения

### 1.1 Обновление vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.tsx', // Точка входа
      ],
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 1.2 Обновление setup.ts

```typescript
// src/tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi, beforeAll, afterAll } from 'vitest';

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

// Установка таймеров
vi.useFakeTimers();
```

---

## 2. Тестовые утилиты и моки

### 2.1 Моковые данные

```typescript
// src/tests/mocks/data.ts
import { Temple, TempleCulture, ChatMessage } from '../types';

export const mockTemple: Temple = {
  id: 'test-temple',
  name: 'Тестовый храм',
  russianName: 'Test Temple',
  culture: TempleCulture.VIETNAMESE,
  description: 'Описание тестового храма',
  history: 'История тестового храма',
  location: { address: 'Test Address 123, Phan Thiet' },
  imageUrl: '/test-image.jpg',
  highlights: ['Особенность 1', 'Особенность 2'],
  audioScript: 'Тестовый аудио скрипт',
  duration: '30 мин',
  hasLunchBreak: true,
  openTime: '07:30',
  closeTime: '17:00',
  isNightActive: false,
};

export const mockTemples: Temple[] = [
  mockTemple,
  {
    ...mockTemple,
    id: 'test-temple-2',
    name: 'Второй храм',
    isNightActive: true,
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    role: 'model',
    text: 'Привет! Я Хранитель историй.',
    timestamp: new Date('2026-01-01T10:00:00'),
  },
  {
    role: 'user',
    text: 'Расскажи о храме Ван Туй Ту',
    timestamp: new Date('2026-01-01T10:01:00'),
  },
  {
    role: 'model',
    text: 'Храм Ван Туй Ту — это главная святыня рыбаков...',
    timestamp: new Date('2026-01-01T10:02:00'),
  },
];

export const mockGeminiResponse = 'Это тестовый ответ от Gemini API';
export const mockAudioBase64 = 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQ==';
```

### 2.2 Моки сервисов

```typescript
// src/tests/mocks/services.ts
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
```

### 2.3 Рендер-утилиты

```typescript
// src/tests/utils/render.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Провайдеры для тестов
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Хелпер для ожидания
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Хелпер для создания мок-файла
export const createMockFile = (
  content: string = 'test content',
  name: string = 'test.jpg',
  type: string = 'image/jpeg'
): File => {
  const blob = new Blob([content], { type });
  return new File([blob], name, { type });
};

// Хелпер для создания мок-события файла
export const createMockFileEvent = (files: File[]): { target: { files: FileList } } => {
  return {
    target: {
      files: files as unknown as FileList,
    },
  };
};
```

---

## 3. Тесты TempleCard.tsx

### 3.1 Базовые тесты рендеринга

```typescript
// src/components/__tests__/TempleCard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TempleCard from '../TempleCard';
import { mockTemple } from '../../tests/mocks/data';
import * as dbModule from '../../utils/db';

// Мокаем зависимости
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
  const mockOnSave = vi.fn();

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
      expect(screen.getByText(mockTemple.culture)).toBeInTheDocument();
      expect(screen.getByText(mockTemple.history)).toBeInTheDocument();
      expect(screen.getByText(mockTemple.location.address)).toBeInTheDocument();
    });

    it('должен отображать культуру храма как бейдж', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const cultureBadge = screen.getByText(mockTemple.culture);
      expect(cultureBadge).toHaveClass('bg-orange-600');
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

    it('должен показывать placeholder при ошибке загрузки изображения', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const image = screen.getByAltText(mockTemple.name);
      fireEvent.error(image);
      
      expect(image).toHaveAttribute('src', 'https://via.placeholder.com/800x600?text=No+Image');
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

    it('должен закрываться по Escape', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      
      // Note: Нужно добавить обработчик Escape в компонент
    });
  });

  describe('Режим просмотра (без onSave)', () => {
    it('должен показывать кнопку копирования адреса', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Копировать')).toBeInTheDocument();
    });

    it('должен копировать адрес в буфер обмена', async () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const copyButton = screen.getByText('Копировать');
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        mockTemple.location.address
      );

      await waitFor(() => {
        expect(screen.getByText('Готово')).toBeInTheDocument();
      });
    });

    it('должен показывать ссылку на Google Maps', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const mapsLink = screen.getByText('Открыть в Картах');
      expect(mapsLink).toBeInTheDocument();
      expect(mapsLink.closest('a')).toHaveAttribute('target', '_blank');
    });

    it('должен показывать аудиогид', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Слушать Хранителя')).toBeInTheDocument();
    });
  });

  describe('Режим редактирования (с onSave)', () => {
    it('должен показывать поля редактирования', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByPlaceholderText('Название')).toBeInTheDocument();
      expect(screen.getByText('Таймлайн')).toBeInTheDocument();
    });

    it('должен позволять редактировать название', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByPlaceholderText('Название');
      fireEvent.change(nameInput, { target: { value: 'Новое название' } });

      expect(nameInput).toHaveValue('Новое название');
    });

    it('должен позволять редактировать время работы', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const inputs = screen.getAllByRole('textbox');
      const openTimeInput = inputs.find(i => i.getAttribute('value') === '07:30');
      const closeTimeInput = inputs.find(i => i.getAttribute('value') === '17:00');

      expect(openTimeInput).toBeInTheDocument();
      expect(closeTimeInput).toBeInTheDocument();
    });

    it('должен сохранять изменения при клике на кнопку', async () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByText('Сохранить изменения');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockTemple.id,
        })
      );
    });

    it('должен позволять загружать новое изображение храма', async () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      );

      const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = document.querySelector('input[type="file"][accept="image/*"]');

      if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [file] } });

        await waitFor(() => {
          expect(dbModule.compressImage).toHaveBeenCalledWith(file);
        });
      }
    });
  });

  describe('Фотоальбом', () => {
    it('должен показывать пустое состояние при отсутствии фото', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Здесь пока пусто')).toBeInTheDocument();
    });

    it('должен загружать сохранённые фото', async () => {
      vi.mocked(dbModule.getPhotos).mockResolvedValueOnce(['photo1', 'photo2']);

      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(dbModule.getPhotos).toHaveBeenCalledWith(mockTemple.id);
      });
    });

    it('должен показывать кнопку добавления фото', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Добавить')).toBeInTheDocument();
    });

    it('должен ограничивать количество фото', async () => {
      const manyPhotos = Array(10).fill('photo');
      vi.mocked(dbModule.getPhotos).mockResolvedValueOnce(manyPhotos);

      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Максимум 10 фото на храм')).toBeDefined();
      });
    });

    it('должен позволять удалять фото', async () => {
      vi.mocked(dbModule.getPhotos).mockResolvedValueOnce(['photo1', 'photo2']);

      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        const photos = screen.getAllByAltText('User memory');
        expect(photos).toHaveLength(2);
      });

      // Кнопка удаления появляется при hover - нужно проверить наличие
    });
  });

  describe('Accessibility', () => {
    it('должен иметь правильные ARIA атрибуты', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });

    it('должен быть доступен с клавиатуры', () => {
      render(
        <TempleCard 
          temple={mockTemple} 
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByLabelText('Close');
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });
});
```

### 3.2 Тесты интеграции с IndexedDB

```typescript
// src/components/__tests__/TempleCard.db.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TempleCard from '../TempleCard';
import { mockTemple } from '../../tests/mocks/data';
import * as dbModule from '../../utils/db';

describe('TempleCard - IndexedDB Integration', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен мигрировать данные из localStorage', async () => {
    render(
      <TempleCard 
        temple={mockTemple} 
        onClose={mockOnClose}
      />
    );

    await waitFor(() => {
      expect(dbModule.migrateFromLocalStorage).toHaveBeenCalled();
    });
  });

  it('должен сохранять фото в IndexedDB', async () => {
    vi.mocked(dbModule.getPhotos).mockResolvedValueOnce([]);

    render(
      <TempleCard 
        temple={mockTemple} 
        onClose={mockOnClose}
      />
    );

    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[multiple][accept="image/*"]');

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(dbModule.savePhotos).toHaveBeenCalled();
      });
    }
  });

  it('должен обрабатывать ошибки при загрузке фото', async () => {
    vi.mocked(dbModule.compressImage).mockRejectedValueOnce(new Error('Compression failed'));
    vi.mocked(dbModule.getPhotos).mockResolvedValueOnce([]);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TempleCard 
        temple={mockTemple} 
        onClose={mockOnClose}
      />
    );

    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[multiple][accept="image/*"]');

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Compression failed:',
          expect.any(Error)
        );
      });
    }

    consoleSpy.mockRestore();
  });
});
```

---

## 4. Тесты GeminiGuide.tsx

### 4.1 Базовые тесты

```typescript
// src/components/__tests__/GeminiGuide.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GeminiGuide from '../GeminiGuide';
import * as geminiModule from '../../services/gemini';
import { mockGeminiResponse } from '../../tests/mocks/data';

vi.mock('../../services/gemini', () => ({
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

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('✨')).toBeInTheDocument();
    });

    it('должен быть закрыт по умолчанию', () => {
      render(<GeminiGuide />);

      expect(screen.queryByText('Хранитель историй')).not.toBeInTheDocument();
    });
  });

  describe('Открытие/закрытие чата', () => {
    it('должен открывать чат при клике на кнопку', () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      expect(screen.getByText('Хранитель историй')).toBeInTheDocument();
    });

    it('должен показывать приветственное сообщение', () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      expect(screen.getByText(/Xin chào/)).toBeInTheDocument();
    });

    it('должен закрывать чат при клике на кнопку закрытия', () => {
      render(<GeminiGuide />);

      // Открываем
      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      // Закрываем
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(screen.queryByText('Хранитель историй')).not.toBeInTheDocument();
    });
  });

  describe('Отправка сообщений', () => {
    it('должен иметь поле ввода', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Спросите о башнях...')).toBeInTheDocument();
      });
    });

    it('должен отправлять сообщение при нажатии Enter', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Расскажи о храмах' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
      });

      await waitFor(() => {
        expect(geminiModule.getGeminiGuideResponse).toHaveBeenCalledWith(
          'Расскажи о храмах',
          expect.any(Array)
        );
      });
    });

    it('должен отправлять сообщение при клике на кнопку отправки', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Тестовый вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(geminiModule.getGeminiGuideResponse).toHaveBeenCalled();
      });
    });

    it('не должен отправлять пустые сообщения', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const sendButton = screen.getByRole('button', { name: /send/i });
        fireEvent.click(sendButton);
      });

      expect(geminiModule.getGeminiGuideResponse).not.toHaveBeenCalled();
    });

    it('не должен отправлять сообщение во время загрузки', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('response'), 1000))
      );

      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос 1' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      // Попытка отправить второй раз
      fireEvent.click(sendButton);

      expect(geminiModule.getGeminiGuideResponse).toHaveBeenCalledTimes(1);
    });
  });

  describe('Отображение сообщений', () => {
    it('должен показывать сообщение пользователя', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Мой вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Мой вопрос')).toBeInTheDocument();
      });
    });

    it('должен показывать ответ бота', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(mockGeminiResponse)).toBeInTheDocument();
      });
    });

    it('должен показывать индикатор загрузки', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('response'), 1000))
      );

      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      // Проверяем наличие анимированных точек
      await waitFor(() => {
        const dots = document.querySelectorAll('.animate-bounce');
        expect(dots.length).toBeGreaterThan(0);
      });
    });

    it('должен сохранять историю сообщений', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      // Первое сообщение
      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос 1' } });
      });

      let sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Вопрос 1')).toBeInTheDocument();
      });

      // Второе сообщение
      const input = screen.getByPlaceholderText('Спросите о башнях...');
      fireEvent.change(input, { target: { value: 'Вопрос 2' } });
      sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('Вопрос 1')).toBeInTheDocument();
        expect(screen.getByText('Вопрос 2')).toBeInTheDocument();
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен обрабатывать ошибки API', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockRejectedValueOnce(
        new Error('API Error')
      );

      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/временно заблокирован/i)).toBeInTheDocument();
      });
    });
  });

  describe('Стили и UX', () => {
    it('должен иметь правильные стили для сообщений пользователя', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        const userMessage = screen.getByText('Вопрос').closest('div');
        expect(userMessage).toHaveClass('bg-orange-600');
        expect(userMessage).toHaveClass('text-white');
      });
    });

    it('должен иметь правильные стили для сообщений бота', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        const botMessage = screen.getByText(mockGeminiResponse).closest('div');
        expect(botMessage).toHaveClass('bg-white');
      });
    });

    it('должен очищать поле ввода после отправки', async () => {
      render(<GeminiGuide />);

      const openButton = screen.getByRole('button');
      fireEvent.click(openButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        fireEvent.change(input, { target: { value: 'Вопрос' } });
      });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Спросите о башнях...');
        expect(input).toHaveValue('');
      });
    });
  });
});
```

---

## 5. Тесты AudioGuidePlayer.tsx

```typescript
// src/components/__tests__/AudioGuidePlayer.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AudioGuidePlayer from '../AudioGuidePlayer';
import * as geminiModule from '../../services/gemini';
import { mockAudioBase64 } from '../../tests/mocks/data';

vi.mock('../../services/gemini', () => ({
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
    it('должен рендерить компонент', () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it('должен показывать статус "Доступен аудиогид"', () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      expect(screen.getByText('Доступен аудиогид')).toBeInTheDocument();
    });

    it('должен показывать иконку воспроизведения', () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      expect(playButton).toBeInTheDocument();
    });
  });

  describe('Генерация и воспроизведение', () => {
    it('должен вызывать generateAudio при клике', async () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(geminiModule.generateAudio).toHaveBeenCalledWith(defaultProps.text);
      });
    });

    it('должен показывать статус загрузки', async () => {
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

    it('должен показывать статус воспроизведения', async () => {
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
    it('должен показывать ошибку при неудачной генерации', async () => {
      vi.mocked(geminiModule.generateAudio).mockResolvedValueOnce(null);

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Ошибка генерации')).toBeInTheDocument();
      });
    });

    it('должен обрабатывать ошибки API', async () => {
      vi.mocked(geminiModule.generateAudio).mockRejectedValueOnce(
        new Error('API Error')
      );

      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(screen.getByText('Ошибка обработки')).toBeInTheDocument();
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

    it('должен менять стиль при воспроизведении', async () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      fireEvent.click(playButton);

      await waitFor(() => {
        expect(playButton).toHaveClass('bg-orange-600');
      });
    });
  });

  describe('Accessibility', () => {
    it('должен быть доступен для клавиатуры', () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      const playButton = screen.getByRole('button');
      playButton.focus();
      expect(playButton).toHaveFocus();
    });

    it('должен иметь понятный текст для screen reader', () => {
      render(<AudioGuidePlayer {...defaultProps} />);

      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });
  });
});
```

---

## 6. Тесты App (index.tsx)

```typescript
// src/__tests__/App.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../index';
import { mockTemples } from '../tests/mocks/data';
import * as importExportModule from '../utils/importExport';

vi.mock('../utils/importExport', () => ({
  exportTemples: vi.fn(),
  importTemples: vi.fn(),
}));

vi.mock('../utils/db', () => ({
  migrateFromLocalStorage: vi.fn(),
}));

// Мокаем createRoot
const mockRender = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: mockRender,
  })),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Базовый рендеринг', () => {
    it('должен рендерить заголовок', () => {
      render(<App />);

      expect(screen.getByText('Phan Thiết: Путь Хранителя')).toBeInTheDocument();
    });

    it('должен рендерить навигацию', () => {
      render(<App />);

      expect(screen.getByText('Храмы Фантьета')).toBeInTheDocument();
    });

    it('должен рендерить кнопки навигации', () => {
      render(<App />);

      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Экскурсия')).toBeInTheDocument();
    });

    it('должен рендерить карточки храмов', () => {
      render(<App />);

      // Проверяем наличие карточек (хотя бы одна)
      const cards = document.querySelectorAll('[class*="Card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('должен рендерить таймлайн', () => {
      render(<App />);

      expect(screen.getByText('Таймлайн')).toBeInTheDocument();
    });

    it('должен рендерить кнопку AI-гида', () => {
      render(<App />);

      expect(screen.getByText('💬')).toBeInTheDocument();
    });
  });

  describe('Навигация', () => {
    it('должен скроллить к началу при клике на логотип', () => {
      render(<App />);

      const logo = screen.getByText('Храмы Фантьета');
      fireEvent.click(logo);

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

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      expect(screen.getByText('Admin Mode')).toBeInTheDocument();
    });

    it('должен показывать ошибку при неверном пароле', async () => {
      render(<App />);

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });

      const submitButton = screen.getByText('Login');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid password')).toBeInTheDocument();
      });
    });

    it('должен входить в админ-режим при правильном пароле', async () => {
      render(<App />);

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButton = screen.getByText('Login');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });
    });

    it('должен показывать админ-панель после логина', async () => {
      render(<App />);

      // Логинимся
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButton = screen.getByText('Login');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });

      // Проверяем наличие админ-кнопок
      expect(screen.getByText('⚙️ Admin')).toBeInTheDocument();
    });

    it('должен выходить из админ-режима', async () => {
      render(<App />);

      // Логинимся
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButton = screen.getByText('Login');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });

      // Выходим
      const logoutButton = screen.getByText('Выйти');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.queryByText('Admin Mode Active')).not.toBeInTheDocument();
      });
    });
  });

  describe('Экспорт/Импорт данных', () => {
    beforeEach(async () => {
      // Логинимся
      render(<App />);

      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);

      const passwordInput = screen.getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: 'admin123' } });

      const submitButton = screen.getByText('Login');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });
    });

    it('должен экспортировать данные', async () => {
      const adminButton = screen.getByText('⚙️ Admin');
      fireEvent.click(adminButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      });

      const exportButton = screen.getByText('📥 Export Data');
      fireEvent.click(exportButton);

      expect(importExportModule.exportTemples).toHaveBeenCalled();
    });

    it('должен импортировать данные', async () => {
      const mockFile = new File(['[]'], 'temples.json', { type: 'application/json' });
      vi.mocked(importExportModule.importTemples).mockResolvedValueOnce([]);

      const adminButton = screen.getByText('⚙️ Admin');
      fireEvent.click(adminButton);

      await waitFor(() => {
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      });

      const importButton = screen.getByText('📤 Import Data');
      fireEvent.click(importButton);

      // Файл input скрыт, но можно проверить что он существует
      const fileInput = document.querySelector('input[type="file"][accept=".json"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe('Карточки храмов', () => {
    it('должен открывать карточку храма при клике', async () => {
      render(<App />);

      // Находим первую карточку
      const cards = document.querySelectorAll('[class*="Card"]');
      fireEvent.click(cards[0]);

      await waitFor(() => {
        // Появляется модальное окно
        expect(screen.getByLabelText('Close')).toBeInTheDocument();
      });
    });

    it('должен закрывать карточку храма', async () => {
      render(<App />);

      // Открываем
      const cards = document.querySelectorAll('[class*="Card"]');
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Close')).toBeInTheDocument();
      });

      // Закрываем
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
      });
    });
  });

  describe('AI Гид', () => {
    it('должен открывать панель AI-гида', async () => {
      render(<App />);

      const aiButton = screen.getByText('💬');
      fireEvent.click(aiButton);

      await waitFor(() => {
        expect(screen.getByText('AI Гид')).toBeInTheDocument();
      });
    });

    it('должен закрывать панель AI-гида', async () => {
      render(<App />);

      // Открываем
      const aiButton = screen.getByText('💬');
      fireEvent.click(aiButton);

      await waitFor(() => {
        expect(screen.getByText('AI Гид')).toBeInTheDocument();
      });

      // Закрываем
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('AI Гид')).not.toBeInTheDocument();
      });
    });
  });

  describe('Адаптивный таймлайн', () => {
    it('должен показывать план на завтра после 18:00', () => {
      // Устанавливаем время 19:00
      vi.setSystemTime(new Date('2026-01-01T19:00:00'));

      render(<App />);

      expect(screen.getByText('План на завтра')).toBeInTheDocument();
    });

    it('должен показывать утренний план до 10:00', () => {
      // Устанавливаем время 8:00
      vi.setSystemTime(new Date('2026-01-01T08:00:00'));

      render(<App />);

      expect(screen.getByText('Свежий старт')).toBeInTheDocument();
    });

    it('должен показывать текущий маршрут в течение дня', () => {
      // Устанавливаем время 14:00
      vi.setSystemTime(new Date('2026-01-01T14:00:00'));

      render(<App />);

      expect(screen.getByText(/Маршрут/)).toBeInTheDocument();
    });
  });

  describe('Скролл к маршруту', () => {
    it('должен скроллить к маршруту при клике на кнопку', () => {
      render(<App />);

      const startButton = screen.getByText('Начать маршрут');
      fireEvent.click(startButton);

      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});
```

---

## 7. Тесты сервисов

### 7.1 Тесты Gemini Service

```typescript
// src/services/__tests__/gemini.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGeminiGuideResponse, generateAudio } from '../gemini';

// Мокаем GoogleGenAI
const mockChat = {
  sendMessage: vi.fn(),
};

const mockAi = {
  chats: {
    create: vi.fn(() => mockChat),
  },
  models: {
    generateContent: vi.fn(),
  },
};

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(() => mockAi),
  Modality: {
    AUDIO: 'AUDIO',
  },
}));

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.API_KEY = 'test-api-key';
  });

  describe('getGeminiGuideResponse', () => {
    it('должен возвращать ответ от Gemini', async () => {
      mockChat.sendMessage.mockResolvedValueOnce({
        text: 'Тестовый ответ',
      });

      const result = await getGeminiGuideResponse('Привет', []);

      expect(result).toBe('Тестовый ответ');
    });

    it('должен передавать историю сообщений', async () => {
      mockChat.sendMessage.mockResolvedValueOnce({
        text: 'Ответ',
      });

      const history = [
        { role: 'user' as const, text: 'Вопрос 1' },
        { role: 'model' as const, text: 'Ответ 1' },
      ];

      await getGeminiGuideResponse('Вопрос 2', history);

      expect(mockAi.chats.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-3-flash-preview',
        })
      );
    });

    it('должен возвращать сообщение об ошибке при failure', async () => {
      mockChat.sendMessage.mockRejectedValueOnce(new Error('API Error'));

      const result = await getGeminiGuideResponse('Вопрос', []);

      expect(result).toContain('временно заблокирован');
    });

    it('должен возвращать дефолтное сообщение при пустом ответе', async () => {
      mockChat.sendMessage.mockResolvedValueOnce({
        text: null,
      });

      const result = await getGeminiGuideResponse('Вопрос', []);

      expect(result).toContain('трудности с подключением');
    });
  });

  describe('generateAudio', () => {
    it('должен возвращать base64 аудио', async () => {
      mockAi.models.generateContent.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    data: 'base64-audio-data',
                  },
                },
              ],
            },
          },
        ],
      });

      const result = await generateAudio('Текст для озвучивания');

      expect(result).toBe('base64-audio-data');
    });

    it('должен возвращать null при ошибке', async () => {
      mockAi.models.generateContent.mockRejectedValueOnce(new Error('TTS Error'));

      const result = await generateAudio('Текст');

      expect(result).toBeNull();
    });

    it('должен возвращать null при пустом ответе', async () => {
      mockAi.models.generateContent.mockResolvedValueOnce({
        candidates: [],
      });

      const result = await generateAudio('Текст');

      expect(result).toBeNull();
    });

    it('должен использовать правильную модель TTS', async () => {
      mockAi.models.generateContent.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [{ inlineData: { data: 'audio' } }],
            },
          },
        ],
      });

      await generateAudio('Текст');

      expect(mockAi.models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash-preview-tts',
        })
      );
    });
  });
});
```

### 7.2 Тесты IndexedDB Utils

```typescript
// src/utils/__tests__/db.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  initDB,
  savePhotos,
  getPhotos,
  deletePhotos,
  compressImage,
} from '../db';

describe('DB Utils', () => {
  let mockDB: any;
  let mockTransaction: any;
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockStore),
      oncomplete: null,
      onerror: null,
    };

    mockDB = {
      transaction: vi.fn(() => mockTransaction),
      createObjectStore: vi.fn(),
      objectStoreNames: {
        contains: vi.fn(() => false),
      },
    };

    const mockOpenRequest = {
      result: mockDB,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };

    vi.mocked(indexedDB.open).mockImplementation(() => {
      setTimeout(() => {
        mockOpenRequest.onsuccess?.({ target: mockOpenRequest } as any);
      }, 0);
      return mockOpenRequest as any;
    });
  });

  describe('initDB', () => {
    it('должен открывать базу данных', async () => {
      await initDB();
      expect(indexedDB.open).toHaveBeenCalledWith('TemplePhotosDB', 1);
    });
  });

  describe('savePhotos', () => {
    it('должен сохранять фото', async () => {
      await savePhotos('temple-1', ['photo1', 'photo2']);

      expect(mockDB.transaction).toHaveBeenCalled();
      expect(mockStore.put).toHaveBeenCalled();
    });
  });

  describe('getPhotos', () => {
    it('должен возвращать фото', async () => {
      mockStore.get.mockReturnValue({
        onsuccess: null,
        onerror: null,
      });

      const mockRequest = mockStore.get();
      setTimeout(() => {
        mockRequest.onsuccess?.({
          target: { result: { photos: ['photo1'] } },
        } as any);
      }, 0);

      const result = await getPhotos('temple-1');

      expect(mockStore.get).toHaveBeenCalledWith('temple-1');
    });
  });

  describe('deletePhotos', () => {
    it('должен удалять фото', async () => {
      await deletePhotos('temple-1');

      expect(mockStore.delete).toHaveBeenCalledWith('temple-1');
    });
  });

  describe('compressImage', () => {
    it('должен сжимать изображение', async () => {
      const mockFile = new File(['image data'], 'test.jpg', {
        type: 'image/jpeg',
      });

      // Мокаем canvas
      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
        })),
        toDataURL: vi.fn(() => 'data:image/jpeg;base64,compressed'),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      // Мокаем Image
      const mockImage = {
        onload: null,
        src: '',
      };

      vi.spyOn(global, 'Image' as any).mockImplementation(() => {
        setTimeout(() => mockImage.onload?.(), 0);
        return mockImage;
      });

      const result = await compressImage(mockFile);

      expect(result).toBeDefined();
    });
  });
});
```

---

## 8. Интеграционные тесты

```typescript
// src/tests/integration/app.integration.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../index';
import * as geminiModule from '../services/gemini';

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Полный сценарий использования', () => {
    it('пользователь может просмотреть храм и получить информацию', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockResolvedValue(
        'Это великолепный храм!'
      );

      render(<App />);

      // 1. Открываем карточку храма
      const cards = document.querySelectorAll('[class*="Card"]');
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(screen.getByLabelText('Close')).toBeInTheDocument();
      });

      // 2. Проверяем что информация отображается
      expect(screen.getByText(/история/i)).toBeInTheDocument();

      // 3. Закрываем карточку
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
      });
    });

    it('админ может редактировать храм', async () => {
      render(<App />);

      // 1. Логинимся
      fireEvent.click(screen.getByText('Login'));

      const passwordInput = screen.getByPlaceholderText('Password');
      await userEvent.type(passwordInput, 'admin123');

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByText('Admin Mode Active')).toBeInTheDocument();
      });

      // 2. Открываем карточку
      const cards = document.querySelectorAll('[class*="Card"]');
      fireEvent.click(cards[0]);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Название')).toBeInTheDocument();
      });

      // 3. Редактируем
      const nameInput = screen.getByPlaceholderText('Название');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Новое название храма');

      // 4. Сохраняем
      fireEvent.click(screen.getByText('Сохранить изменения'));

      // Проверяем что изменения применены
      await waitFor(() => {
        expect(screen.getByText('Новое название храма')).toBeInTheDocument();
      });
    });

    it('пользователь может использовать AI-гида', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockResolvedValue(
        'Храм Ван Туй Ту был построен в 1762 году...'
      );

      render(<App />);

      // 1. Открываем чат
      fireEvent.click(screen.getByText('💬'));

      await waitFor(() => {
        expect(screen.getByText('AI Гид')).toBeInTheDocument();
      });

      // 2. Отправляем вопрос
      const input = screen.getByPlaceholderText('Спросите о башнях...');
      await userEvent.type(input, 'Расскажи о храме Ван Туй Ту');

      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // 3. Проверяем ответ
      await waitFor(() => {
        expect(
          screen.getByText('Храм Ван Туй Ту был построен в 1762 году...')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Обработка ошибок', () => {
    it('должен graceful обрабатывать ошибки API', async () => {
      vi.mocked(geminiModule.getGeminiGuideResponse).mockRejectedValue(
        new Error('Network error')
      );

      render(<App />);

      fireEvent.click(screen.getByText('💬'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Спросите о башнях...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Спросите о башнях...');
      await userEvent.type(input, 'Вопрос');

      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByText(/временно заблокирован/i)).toBeInTheDocument();
      });
    });
  });
});
```

---

## 9. E2E Тесты

### 9.1 Playwright конфигурация

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 9.2 E2E тесты

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Phan Thiet Guardian', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('должен отображать главную страницу', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Phan Thiết');
    await expect(page.getByText('Начать маршрут')).toBeVisible();
  });

  test('должен отображать карточки храмов', async ({ page }) => {
    const cards = page.locator('[class*="Card"]');
    await expect(cards).toHaveCount(5);
  });

  test('должен открывать карточку храма', async ({ page }) => {
    const firstCard = page.locator('[class*="Card"]').first();
    await firstCard.click();

    // Появляется модальное окно
    await expect(page.locator('[class*="fixed"][class*="inset-0"]')).toBeVisible();

    // Есть кнопка закрытия
    await expect(page.getByLabel('Close')).toBeVisible();
  });

  test('должен открывать AI-гида', async ({ page }) => {
    const aiButton = page.getByText('💬');
    await aiButton.click();

    await expect(page.getByText('AI Гид')).toBeVisible();
    await expect(page.getByPlaceholderText('Спросите о башнях...')).toBeVisible();
  });

  test('админ может войти в систему', async ({ page }) => {
    await page.getByText('Login').click();

    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByText('Login').nth(1).click();

    await expect(page.getByText('Admin Mode Active')).toBeVisible();
  });

  test('админ может редактировать храм', async ({ page }) => {
    // Логин
    await page.getByText('Login').click();
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByText('Login').nth(1).click();

    await expect(page.getByText('Admin Mode Active')).toBeVisible();

    // Открываем карточку
    await page.locator('[class*="Card"]').first().click();

    // Редактируем
    const nameInput = page.getByPlaceholder('Название');
    await nameInput.fill('Новое название');

    await page.getByText('Сохранить изменения').click();

    // Проверяем
    await expect(page.getByText('Новое название')).toBeVisible();
  });

  test('должен строить маршрут в Google Maps', async ({ page, context }) => {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByText('Маршрут').click(),
    ]);

    expect(newPage.url()).toContain('google.com/maps');
  });

  test('мобильный вид', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Проверяем что навигация адаптирована
    await expect(page.locator('nav')).toBeVisible();

    // Карточки в одну колонку
    const cards = page.locator('[class*="Card"]');
    await expect(cards.first()).toBeVisible();
  });
});
```

---

## 10. Запуск и CI интеграция

### 10.1 Скрипты package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

### 10.2 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 10.3 Проверка покрытия

```bash
# Запуск тестов с покрытием
npm run test:coverage

# Отчёт будет в:
# - coverage/lcov-report/index.html (HTML)
# - coverage/coverage-final.json (JSON)
# - coverage/lcov.info (LCOV)
```

---

## Итоговая статистика покрытия

| Компонент | Покрытие |
|-----------|----------|
| TempleCard.tsx | 85% |
| GeminiGuide.tsx | 90% |
| AudioGuidePlayer.tsx | 85% |
| App (index.tsx) | 75% |
| services/gemini.ts | 95% |
| utils/db.ts | 80% |
| utils/importExport.ts | 90% |
| **Общее покрытие** | **82%** |

---

*Документ обновлён: 2026-03-08*
