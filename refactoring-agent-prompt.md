# Промпт для агента рефакторинга phanthiet-guardian

## Контекст

Ты агент, выполняющий рефакторинг проекта **phanthiet-guardian** — React 19 приложения для туристического гида по храмам Фантьета (Вьетнам).

### Технологический стек
- React 19.2.4 + TypeScript 5.8.2
- Vite 6.2.0 + Tailwind CSS 4.2.1
- shadcn/ui + Radix UI
- Google Gemini API (чат + TTS)
- IndexedDB для хранения фото

### Текущие проблемы
| Файл | Строк | Проблема |
|------|-------|----------|
| index.tsx | 433 | Монолит, смешение UI/логики/состояния |
| TempleCard.tsx | 345 | Смешивает просмотр/редактирование/галерею/аудио |
| GeminiGuide.tsx | 108 | Состояние в компоненте |
| AudioGuidePlayer.tsx | 130 | Бизнес-логика Web Audio API |

---

## Цель рефакторинга

Упростить архитектуру, выделив кастомные хуки и разбив монолитные компоненты, **без over-engineering**.

---

## Принципы (ОБЯЗАТЕЛЬНО)

1. **Не делить малые файлы** — `types.ts` (856 байт) и `constants.ts` (4.7KB) остаются едиными
2. **Не добавлять Zod** — пока нет external data sources
3. **Minimal viable split** — TempleCard → 4 компонента, не больше
4. **Логика → utils** — чистые функции отдельно от хуков
5. **Тестируемость** — каждый хук можно тестировать изолированно

---

## Структура для создания

### Этап 1: Кастомные хуки

Создай следующие хуки в `src/hooks/`:

#### 1. `useTempleData.ts` (~80 строк)
```typescript
interface UseTempleDataReturn {
  temples: Temple[];
  selectedTemple: Temple | null;
  setSelectedTemple: (temple: Temple | null) => void;
  updateTemple: (id: string, updates: Partial<Temple>) => void;
  importTemples: (temples: Temple[]) => void;
  exportTemples: () => Temple[];
}
```
- Управляет списком храмов
- Синхронизация с localStorage
- Импорт/экспорт данных

#### 2. `useAdmin.ts` (~40 строк)
```typescript
interface UseAdminReturn {
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}
```
- Пароль из `import.meta.env.VITE_ADMIN_PASSWORD` или fallback 'admin123'
- Состояние хранится в sessionStorage

#### 3. `useSchedule.ts` (~60 строк)
```typescript
interface UseScheduleReturn {
  schedule: ScheduleItem[];
  context: PlanContext;
  buildGoogleMapsRoute: () => string;
}
```
- Использует `utils/scheduleCalculations.ts` для чистой логики
- Управляет расписанием посещения

#### 4. `usePhotos.ts` (~70 строк)
```typescript
interface UsePhotosReturn {
  photos: string[];
  isLoading: boolean;
  addPhoto: (file: File) => Promise<void>;
  removePhoto: (index: number) => void;
}
```
- Интеграция с IndexedDB через существующий `utils/db.ts`
- Сжатие изображений

#### 5. `useGemini.ts` (~50 строк)
```typescript
interface UseGeminiReturn {
  getResponse: (message: string, history: ChatMessage[]) => Promise<string>;
  clearCache: () => void;
  isLoading: boolean;
  error: Error | null;
}
```
- Кеширование ответов
- Retry логика (3 попытки)
- Использует существующий `services/gemini.ts`

#### 6. `useAudio.ts` (~90 строк)
```typescript
interface UseAudioReturn {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  play: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}
```
- Web Audio API логика
- Декодирование через `utils/audioDecoder.ts`

---

### Этап 2: Utils для чистых функций

Создай в `src/utils/`:

#### 1. `scheduleCalculations.ts`
```typescript
export function getPlanContext(): PlanContext;
export function calculateSchedule(temples: Temple[]): ScheduleItem[];
export function formatTime(date: Date): string;
```

#### 2. `audioDecoder.ts`
```typescript
export async function decodeWavBase64(
  base64: string, 
  audioContext: AudioContext
): Promise<AudioBuffer>;
```

#### 3. `formatters.ts`
```typescript
export function formatTime(date: Date): string;
export function formatDate(date: Date): string;
export function formatDuration(minutes: number): string;
```

---

### Этап 3: Разделение компонентов

#### Layout (вынос из index.tsx)

`src/components/layout/Navbar.tsx` (~50 строк):
- Навигация
- Кнопки admin
- Логотип

`src/components/layout/Header.tsx` (~60 строк):
- Hero секция
- Plan context display
- Кнопка "Начать маршрут"

`src/components/layout/Footer.tsx` (~30 строк):
- Футер с копирайтом
- Ссылки

`src/components/layout/FloatingButtons.tsx` (~40 строк):
- Кнопка чата (GeminiGuide trigger)
- Scroll to top

#### Temple (разделение TempleCard)

`src/components/temple/TempleCard.tsx` (~60 строк):
```typescript
interface TempleCardProps {
  temple: Temple;
  onClose: () => void;
  onSave?: (temple: Temple) => void;
}
```
- Dialog wrapper
- Управление режимом редактирования
- Композиция подкомпонентов

`src/components/temple/TempleCardView.tsx` (~120 строк):
- Режим просмотра
- Информация о храме
- История
- Фото галерея
- Кнопки действий (карты, аудио)

`src/components/temple/TempleCardEdit.tsx` (~100 строк):
- Форма редактирования (только для admin)
- Поля: название, описание, время работы
- Загрузка изображения

`src/components/temple/TempleGallery.tsx` (~60 строк):
- Галерея фото
- Загрузка новых фото
- Удаление фото

#### Schedule

`src/components/schedule/Schedule.tsx` (~40 строк):
- Контейнер
- Использует useSchedule

`src/components/schedule/Timeline.tsx` (~80 строк):
- Визуализация графика
- Прогресс бар

`src/components/schedule/SunsetIndicator.tsx` (~20 строк):
- Индикатор заката

#### Admin

`src/components/admin/AdminLoginDialog.tsx` (~50 строк):
- Диалог входа
- Поле пароля

`src/components/admin/AdminPanel.tsx` (~60 строк):
- Панель управления
- Импорт/экспорт данных

`src/components/admin/AdminModeBanner.tsx` (~20 строк):
- Баннер режима администратора

---

### Этап 4: Упрощение существующих компонентов

#### `GeminiGuide.tsx` (~60 строк)
- Только UI
- Логика в useGemini

#### `AudioGuidePlayer.tsx` (~50 строк)
- Только UI
- Логика в useAudio

---

### Этап 5: Переименование index.tsx

1. **Переименовать** `src/index.tsx` → `src/App.tsx`
2. **Создать новый** `src/index.tsx`:
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
```

3. **Упростить App.tsx** до ~120 строк:
- Только композиция компонентов
- Использование хуков
- Минимум inline логики

---

## Критерии успеха

После рефакторинга:

| Критерий | Значение |
|----------|----------|
| App.tsx | ≤150 строк, только JSX и композиция |
| Каждый хук | ≤100 строк, тестируем изолированно |
| Каждый компонент | ≤150 строк, Single Responsibility |
| TypeScript | Нет `any` в публичных API (хуки, props) |
| Разделение | Логика в хуках/utils, UI в компонентах |

---

## Порядок выполнения

1. **Создать утилиты** (`utils/*.ts`)
2. **Создать хуки** (начиная с `useTempleData`, `useSchedule`)
3. **Создать layout компоненты**
4. **Разделить TempleCard** на 4 компонента
5. **Упростить GeminiGuide и AudioGuidePlayer**
6. **Переименовать и упростить App.tsx**
7. **Проверить работоспособность**

---

## Важные ограничения

- **НЕ удаляй** ни один существующий файл (только переименовывай)
- **НЕ меняй** функциональность — только структура
- **НЕ добавляй** новые зависимости
- **НЕ трогай** `types.ts` и `constants.ts`
- **СОХРАНИ** все существующие импорты из `services/gemini.ts` и `utils/db.ts`

---

## Ожидаемый результат

После завершения рефакторинга предоставить:

1. Список созданных файлов с кратким описанием
2. Список изменённых файлов
3. Сравнение строк до/после для ключевых файлов
4. Инструкцию по проверке работоспособности
5. Рекомендации по дальнейшим улучшениям

---

## Пример кода для справки

### Пример хука useTempleData

```typescript
// src/hooks/useTempleData.ts
import { useState, useEffect, useCallback } from 'react';
import { Temple } from '../types';
import { TEMPLES } from '../constants';

export function useTempleData() {
  const [temples, setTemples] = useState<Temple[]>(() => {
    const saved = localStorage.getItem('phanthiet-temples');
    return saved ? JSON.parse(saved) : TEMPLES;
  });
  
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  // Сохранение при изменении
  useEffect(() => {
    localStorage.setItem('phanthiet-temples', JSON.stringify(temples));
  }, [temples]);

  const updateTemple = useCallback((id: string, updates: Partial<Temple>) => {
    setTemples(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }, []);

  const importTemples = useCallback((newTemples: Temple[]) => {
    setTemples(newTemples);
  }, []);

  const exportTemples = useCallback(() => {
    return temples;
  }, [temples]);

  return {
    temples,
    selectedTemple,
    setSelectedTemple,
    updateTemple,
    importTemples,
    exportTemples,
  };
}
```

### Пример компонента TempleCard (новый)

```typescript
// src/components/temple/TempleCard.tsx
import { useState } from 'react';
import { Dialog, DialogContent } from '@/ui/dialog';
import { Temple } from '@/types';
import { TempleCardView } from './TempleCardView';
import { TempleCardEdit } from './TempleCardEdit';
import { usePhotos } from '@/hooks/usePhotos';

interface TempleCardProps {
  temple: Temple;
  onClose: () => void;
  onSave?: (temple: Temple) => void;
}

export function TempleCard({ temple, onClose, onSave }: TempleCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { photos, addPhoto, removePhoto } = usePhotos(temple.id);

  const handleSave = (updates: Partial<Temple>) => {
    onSave?.({ ...temple, ...updates });
    setIsEditing(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {isEditing && onSave ? (
          <TempleCardEdit 
            temple={temple} 
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <TempleCardView
            temple={temple}
            photos={photos}
            onAddPhoto={addPhoto}
            onRemovePhoto={removePhoto}
            onEdit={onSave ? () => setIsEditing(true) : undefined}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

**Начни выполнение с создания утилит, затем хуков. После каждого этапа проверяй, что приложение компилируется без ошибок.**
