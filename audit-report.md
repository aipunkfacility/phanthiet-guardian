# АУДИТ КОДОВОЙ БАЗЫ
## Проект: Phan Thiet Guardian (Храмы Фантьета)

**Репозиторий:** https://github.com/aipunkfacility/phanthiet-guardian  
**Контекст:** Маленький одноразовый проект, dev-стадия  
**Дата аудита:** 9 марта 2025  

---

## 1. ОБЩАЯ ОЦЕНКА

**Проект в хорошем состоянии.** Код чистый, архитектура понятная, зависимости актуальные. Для маленького pet/dev-проекта — отлично.

| Критерий | Оценка |
|----------|--------|
| Читаемость кода | ✅ Хорошо |
| Структура проекта | ✅ Хорошо |
| Типизация | ✅ Хорошо |
| Зависимости | ✅ Актуальные |
| Тесты | 🟡 Базовые есть |

---

## 2. ЧТО НУЖНО ПОЧИНИТЬ

### 2.1 Дублирование файлов (5 минут)

**Проблема:** Два идентичных файла `lib/utils.ts` и `src/lib/utils.ts`.

**Решение:** Удалить `lib/utils.ts` (корневой), оставить только `src/lib/utils.ts`.

```bash
rm lib/utils.ts
```

### 2.2 Дублирование функций (10 минут)

**Проблема:** Функции `formatTime`, `formatDate`, `formatDuration` определены в двух местах:
- `src/utils/formatters.ts`
- `src/utils/scheduleCalculations.ts`

**Решение:** Оставить только в `formatters.ts`, в `scheduleCalculations.ts` импортировать:

```typescript
// В scheduleCalculations.ts
import { formatTime, formatDate, formatDuration } from './formatters';
```

### 2.3 Deprecated метод (2 минуты)

**Файл:** `src/utils/formatters.ts:56`

```typescript
// Было:
return Math.random().toString(36).substr(2, 9);

// Стало:
return Math.random().toString(36).slice(2, 11);
```

### 2.4 Неиспользуемые экспорты (5 минут)

В хуках есть функции, которые нигде не используются:

**`src/hooks/useTempleData.ts`:**
- `useSelectedTemple`
- `useTempleStorage`

**`src/hooks/useAdmin.ts`:**
- `useAdminMode`
- `useAdminProtection`

**Решение:** Удалить их. Если понадобятся позже — вернёте из git.

### 2.5 Устаревший пакет (3 минуты)

**Файл:** `package.json`

```json
"radix-ui": "^1.4.3",  // Удалить — deprecated
```

Уже используются правильные пакеты `@radix-ui/react-dialog` и `@radix-ui/react-label`.

---

## 3. ЧТО МОЖНО ОСТАВИТЬ КАК ЕСТЬ

### 3.1 API-ключ на клиенте ✅ Ок для dev

Для dev-проекта без публичного деплоя — нормально. Ключ в `.env.local`, не коммитится.

### 3.2 Пароль `admin123` ✅ Ок для dev

Для локальной разработки — достаточно. Не тратите время на сложную авторизацию.

### 3.3 localStorage ✅ Ок

Для маленького проекта — самое то. Не нужен Redux/Zustand.

### 3.4 Покрытие тестами ✅ Базовое есть

Тесты на основные компоненты есть. Для dev-проекта достаточно.

---

## 4. МЕЛКИЕ УЛУЧШЕНИЯ (ОПЦИОНАЛЬНО)

### 4.1 Вынести магические числа

**Было:**
```typescript
const arrivalTime = new Date(startTime.getTime() + index * 45 * 60000);
```

**Стало:**
```typescript
const TRAVEL_TIME_MINUTES = 45;
const MS_PER_MINUTE = 60000;
const arrivalTime = new Date(startTime.getTime() + index * TRAVEL_TIME_MINUTES * MS_PER_MINUTE);
```

### 4.2 Inline SVG → lucide-react

В `App.tsx` есть inline SVG для иконки локации. Можно заменить на иконку из lucide-react:

```typescript
import { MapPin } from 'lucide-react';
// ...
<MapPin className="w-4 h-4" />
```

### 4.3 Дублирование в документации

**Файл:** `PROJECT_SUMMARY.md`

Строки 54-105 дублируют структуру проекта. Удалить дубликат.

### 4.4 Несоответствие моделей AI

**Файл:** `src/services/gemini.ts`

Для чата используется `gemini-3-flash-preview`, для TTS — `gemini-2.5-flash-preview-tts`. В документации (`AGENTS.md`, `PROJECT_SUMMARY.md`) это не объяснено. Добавить комментарий в код:

```typescript
// Чат: gemini-3-flash-preview
// TTS: gemini-2.5-flash-preview-tts (специализированная модель для синтеза речи)
```

### 4.5 JSDoc для публичных функций

Функции без документации:

```typescript
// src/utils/formatters.ts
export function formatTime(date: Date): string

// src/utils/scheduleCalculations.ts
export function calculateSchedule(temples: Temple[]): ScheduleItem[]
```

Можно добавить краткое описание:

```typescript
/**
 * Форматирует дату в время (ЧЧ:ММ)
 */
export function formatTime(date: Date): string
```

---

## 5. ИТОГОВЫЙ СПИСОК ПРАВОК

| # | Задача | Время | Приоритет |
|---|--------|-------|-----------|
| 1 | Удалить `lib/utils.ts` | 1 мин | Сделать |
| 2 | Убрать дублирование formatters | 10 мин | Сделать |
| 3 | Заменить `substr` на `slice` | 1 мин | Сделать |
| 4 | Удалить неиспользуемые функции | 5 мин | Сделать |
| 5 | Удалить `radix-ui` из package.json | 1 мин | Сделать |

**Общее время: ~20 минут**

---

## 6. ЗАКЛЮЧЕНИЕ

Код написан хорошо. Проект чистый, понятный, с нормальной структурой. Всё что нужно — почистить дублирование и неиспользуемый код. Это займёт минут 20 и проект станет чище.

**Оценка проекта: 8/10** для контекста маленького dev-проекта.

---

*Аудит завершён 9 марта 2025. Вопросов по качеству кода нет.*
