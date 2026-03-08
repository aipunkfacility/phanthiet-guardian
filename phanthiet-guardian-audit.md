# Полный аудит проекта phanthiet-guardian

**Репозиторий:** https://github.com/aipunkfacility/phanthiet-guardian  
**Автор:** aipunkfacility (Alex Finaev)  
**Дата аудита:** 2026-03-08  
**Версия:** v1.2.0

---

## 1. Общая информация о проекте

### 1.1 Назначение

**Phan Thiet Guardian** (Хранитель Фантьета) — интерактивный туристический гид по священным местам Фантьета, Вьетнам. Приложение представляет собой веб-приложение с AI-ассистентом, аудио-гидом и персональным фотоальбомом.

### 1.2 Метаданные репозитория

| Параметр | Значение |
|----------|----------|
| Создан | 2026-02-25 |
| Последнее обновление | 2026-03-08 |
| Размер | 4055 KB |
| Язык | TypeScript |
| Ветки | main |
| Коммиты | 20 |
| Stars | 0 |
| Forks | 0 |
| Лицензия | Отсутствует |
| Issues | 0 |
| Wiki | Нет |

### 1.3 Структура проекта

```
phanthiet-guardian/
├── public/                 # Статические файлы (изображения)
├── src/
│   ├── components/         # React компоненты
│   │   ├── AudioGuidePlayer.tsx    (4878 байт)
│   │   ├── GeminiGuide.tsx         (5106 байт)
│   │   └── TempleCard.tsx          (16271 байт)
│   ├── services/           # API сервисы
│   ├── ui/                 # shadcn/ui компоненты
│   ├── lib/                # Утилиты (cn())
│   ├── utils/              # Помощники (db, importExport)
│   ├── tests/              # Тесты Vitest
│   ├── types.ts            # TypeScript типы (856 байт)
│   ├── constants.ts        # Константы и данные храмов (4768 байт)
│   ├── index.tsx           # Главный компонент (19331 байт)
│   └── index.css           # Стили TailwindCSS (4872 байт)
├── lib/                    # Общие утилиты
├── index.html              # Точка входа HTML
├── package.json            # Зависимости
├── tsconfig.json           # Конфигурация TypeScript
├── vite.config.ts          # Конфигурация Vite
├── vitest.config.ts        # Конфигурация тестов
├── eslint.config.js        # Конфигурация ESLint
├── prettier.config.js      # Конфигурация Prettier
├── components.json         # Конфигурация shadcn/ui
├── .gitignore              # Игнорируемые файлы
├── README.md               # Документация
├── PROJECT_SUMMARY.md      # Полное описание проекта
├── CHANGELOG.md            # История изменений
├── BACKLOG.md              # Задачи на будущее
├── AGENTS.md               # Инструкции для AI-агентов
└── llms.txt                # Контекст для LLM
```

---

## 2. Технологический стек

### 2.1 Основные технологии

| Категория | Технология | Версия |
|-----------|------------|--------|
| **Frontend Framework** | React | 19.2.4 |
| **Language** | TypeScript | 5.8.2 |
| **Bundler** | Vite | 6.2.0 |
| **Styling** | Tailwind CSS | 4.2.1 |
| **UI Library** | shadcn/ui | 3.8.5 |
| **Icons** | lucide-react | 0.575.0 |
| **AI API** | Google Gemini | @google/genai 1.39.0 |
| **Testing** | Vitest | 2.1.0 |
| **Linting** | ESLint | 9.10.0 |
| **Formatting** | Prettier | 3.3.3 |

### 2.2 Зависимости

#### Production Dependencies
```json
{
  "@google/genai": "^1.39.0",
  "@radix-ui/react-dialog": "^1.1.15",
  "@radix-ui/react-label": "^2.1.8",
  "browser-image-compression": "^2.0.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^0.575.0",
  "next-themes": "^0.4.6",
  "radix-ui": "^1.4.3",
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.5.0"
}
```

#### Dev Dependencies
```json
{
  "@eslint/js": "^9.10.0",
  "@tailwindcss/vite": "^4.2.1",
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^16.0.0",
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "eslint": "^9.10.0",
  "eslint-plugin-react": "^7.37.1",
  "eslint-plugin-react-hooks": "^5.1.0",
  "globals": "^15.10.0",
  "jsdom": "^26.0.0",
  "prettier": "^3.3.3",
  "shadcn": "^3.8.5",
  "tailwindcss": "^4.2.1",
  "tw-animate-css": "^1.4.0",
  "typescript": "~5.8.2",
  "typescript-eslint": "^8.5.0",
  "vite": "^6.2.0",
  "vitest": "^2.1.0"
}
```

### 2.3 Анализ языков программирования

| Язык | Байт | Процент |
|------|------|---------|
| TypeScript | 82,034 | 91.8% |
| CSS | 4,872 | 5.5% |
| HTML | 1,610 | 1.8% |
| JavaScript | 1,079 | 1.2% |

---

## 3. Аудит качества кода

### 3.1 TypeScript конфигурация

**Файл:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": false,  // ⚠️ Не включён strict mode
    "paths": { "@/*": ["./*"] },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

**Проблемы:**
- ⚠️ **Не включён `strict` режим** — снижает безопасность типов
- ⚠️ **Отсутствуют проверки:** `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`

**Рекомендации:**
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 3.2 ESLint конфигурация

**Файл:** `eslint.config.js`

**Положительные аспекты:**
- ✅ Использование современных flat config
- ✅ Подключены правила React Hooks
- ✅ Автоматическое определение версии React
- ✅ Игнорируются `dist`, `node_modules`, `coverage`

**Правила:**
```javascript
{
  'react/react-in-jsx-scope': 'off',        // OK для React 19
  'react/prop-types': 'off',                // OK при TypeScript
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'warn',
  'no-console': ['warn', { allow: ['warn', 'error'] }]
}
```

**Проблемы:**
- ⚠️ `no-explicit-any` только warn, рекомендуется error
- ⚠️ Нет правила для `@typescript-eslint/explicit-function-return-type`

### 3.3 Vite конфигурация

**Файл:** `vite.config.ts`

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: { port: 3000, host: '0.0.0.0' },
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: { alias: { '@': path.resolve(__dirname, './src') } }
  };
});
```

**Проблемы:**
- ⚠️ **Несоответствие стилей:** В README указано использовать `VITE_GEMINI_API_KEY`, но в конфиге используется `GEMINI_API_KEY`
- ⚠️ **Двойное определение:** `process.env.API_KEY` и `process.env.GEMINI_API_KEY` — избыточно

**Рекомендации:**
```typescript
// Использовать только VITE_* переменные
define: {
  'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
}
```

### 3.4 .gitignore анализ

**Проблемы безопасности:**
- ⚠️ **Отсутствует `.env.local` в .gitignore!** — хотя в README сказано создать этот файл с API ключом
- ✅ Игнорируются: `node_modules`, `dist`, `*.local`, логи, IDE файлы

**Рекомендации:**
```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Secrets
*.pem
*.key
```

---

## 4. Аудит безопасности

### 4.1 Критические проблемы

| Уровень | Проблема | Описание |
|---------|----------|----------|
| 🔴 КРИТИЧЕСКАЯ | API ключ в коде | Переменная `process.env.API_KEY` определена в vite.config.ts |
| 🔴 КРИТИЧЕСКАЯ | Хардкoded пароль | Пароль админа `admin123` хранится в коде |
| 🟠 ВЫСОКАЯ | Отсутствие лицензии | Нет файла LICENSE |
| 🟠 ВЫСОКАЯ | Нет .env.example | Нет примера конфигурации |

### 4.2 Хранение данных

| Данные | Место хранения | Безопасность |
|--------|---------------|--------------|
| Пользовательские фото | IndexedDB | ✅ Локально, безопасно |
| API ключ Gemini | `.env.local` | ⚠️ Не в .gitignore |
| Пароль админа | Исходный код | 🔴 Небезопасно |
| Данные храмов | constants.ts | ✅ Безопасно |

### 4.3 Аутентификация

**Проблема:** Пароль администратора `admin123` хардкожен в исходном коде.

**Рекомендации:**
1. Использовать переменную окружения для пароля
2. Добавить хеширование пароля (bcrypt)
3. Реализовать полноценную аутентификацию с JWT

```typescript
// Рекомендуемая реализация
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const isAuthenticated = await verifyPassword(inputPassword, ADMIN_PASSWORD);
```

### 4.4 API безопасность

**Gemini API:**
- API ключ передаётся на клиент
- ⚠️ **Риск:** Ключ может быть извлечён из browser bundle

**Рекомендации:**
1. Перенести вызовы Gemini на backend
2. Использовать proxy server для API запросов
3. Добавить rate limiting

---

## 5. Анализ архитектуры

### 5.1 Компоненты

| Компонент | Размер | Назначение |
|-----------|--------|------------|
| `index.tsx` | 19,331 байт | Главный компонент приложения |
| `TempleCard.tsx` | 16,271 байт | Карточка храма с редактированием |
| `GeminiGuide.tsx` | 5,106 байт | AI-ассистент на базе Gemini |
| `AudioGuidePlayer.tsx` | 4,878 байт | Аудио-плеер для TTS |

**Проблемы:**
- ⚠️ **Большой размер компонентов** — `index.tsx` и `TempleCard.tsx` слишком большие
- ⚠️ **Смешение ответственности** — компоненты содержат и UI, и логику

**Рекомендации:**
1. Разделить `index.tsx` на отдельные компоненты (Hero, Timeline, AdminPanel)
2. Вынести логику в custom hooks (`useTemples`, `useGemini`, `useAudio`)
3. Применить паттерн Container/Presentational

### 5.2 Типы данных

```typescript
enum TempleCulture {
  CHAM = 'Чамы (Индуизм)',
  CHINESE = 'Китай (Буддизм/Даосизм)',
  VIETNAMESE = 'Вьетнам (Традиции)',
  CAODAI = 'Каодай (Синтез религий)',
  HISTORY = 'История и наследие',
}

interface Temple {
  id: string;
  name: string;
  russianName: string;
  culture: TempleCulture;
  description: string;
  history: string;
  location: { address: string };
  imageUrl: string;
  highlights: string[];
  audioScript: string;
  duration: string;
  hasLunchBreak: boolean;
  openTime?: string;
  closeTime?: string;
  isNightActive?: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
```

**Положительные аспекты:**
- ✅ Чёткая типизация
- ✅ Использование enum для культуры
- ✅ Optional поля отмечены

**Проблемы:**
- ⚠️ `ChatMessage.timestamp` — тип `Date`, но при сериализации станет строкой
- ⚠️ Отсутствует валидация данных

### 5.3 Хранение данных

**IndexedDB (utils/db.ts):**
```typescript
// Лимиты
MAX_PHOTOS = 10
MAX_SIZE_MB = 0.5
MAX_WIDTH = 800px
```

**Проблемы:**
- ⚠️ Нет обработки ошибок при переполнении квоты
- ⚠️ Нет миграции версий базы данных

---

## 6. Тестирование

### 6.1 Покрытие тестами

**Файлы тестов:**
- `src/tests/constants.test.ts` — тесты констант
- `src/tests/types.test.ts` — тесты типов
- `src/tests/setup.ts` — настройка тестов

**Проблемы:**
- ⚠️ **Минимальное покрытие** — тестируются только базовые файлы
- ⚠️ **Нет тестов компонентов** — React компоненты не протестированы
- ⚠️ **Нет интеграционных тестов** — API не протестирован

**Рекомендуемое покрытие:**
```
Components:     0% → 80%
Services:       0% → 90%
Utils:          0% → 85%
Overall:        ~5% → 75%
```

### 6.2 Testing Library

Настроена, но не используется:
```json
{
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^16.0.0"
}
```

**Рекомендуемые тесты:**
```typescript
// TempleCard.test.tsx
describe('TempleCard', () => {
  it('renders temple information correctly', () => {
    render(<TempleCard temple={mockTemple} />);
    expect(screen.getByText(mockTemple.name)).toBeInTheDocument();
  });
  
  it('opens admin mode with correct password', async () => {
    // ...
  });
});
```

---

## 7. Документация

### 7.1 Наличие документации

| Файл | Статус | Качество |
|------|--------|----------|
| README.md | ✅ Присутствует | ⭐⭐⭐⭐ Хорошее |
| PROJECT_SUMMARY.md | ✅ Присутствует | ⭐⭐⭐⭐⭐ Отличное |
| CHANGELOG.md | ✅ Присутствует | ⭐⭐⭐⭐ Хорошее |
| BACKLOG.md | ✅ Присутствует | ⭐⭐⭐ Среднее |
| AGENTS.md | ✅ Присутствует | ⭐⭐⭐⭐ Хорошее |
| llms.txt | ✅ Присутствует | ⭐⭐⭐⭐ Хорошее |
| LICENSE | ❌ Отсутствует | — |
| CONTRIBUTING.md | ❌ Отсутствует | — |
| CODE_OF_CONDUCT.md | ❌ Отсутствует | — |

### 7.2 Качество README.md

**Положительные аспекты:**
- ✅ Quick Start инструкции
- ✅ Описание tech stack
- ✅ Структура проекта
- ✅ Описание API

**Проблемы:**
- ⚠️ Нет бейджей (CI/CD, coverage, version)
- ⚠️ Нет скриншотов
- ⚠️ Нет ссылки на demo

---

## 8. CI/CD и DevOps

### 8.1 Анализ

| Элемент | Статус |
|---------|--------|
| GitHub Actions | ❌ Отсутствуют |
| Автоматические тесты | ❌ Не настроены |
| Автоматический деплой | ❌ Не настроен |
| Linting при коммите | ❌ Не настроен |
| Pre-commit hooks | ❌ Не настроены |

### 8.2 Рекомендуемый workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

---

## 9. Анализ зависимостей

### 9.1 Устаревшие зависимости

Проверка не проводилась (требуется `npm outdated`), но:

**Потенциальные проблемы:**
- ⚠️ `@google/genai: ^1.39.0` — fast-moving API, возможны breaking changes
- ⚠️ `react: ^19.2.4` — React 19 ещё новый, возможны баги

### 9.2 Безопасность зависимостей

**Рекомендуется:**
```bash
npm audit
npm audit fix
```

### 9.3 Размер bundle

**Оценка:**
- `package-lock.json`: 493,724 байт — много зависимостей
- Рекомендуется анализ через `vite-bundle-visualizer`

---

## 10. Анализ коммитов

### 10.1 История коммитов

| Дата | Сообщение | Тип |
|------|-----------|-----|
| 2026-02-25 17:15 | feat: add local photos, redesign cards, fix AI chat | Feature |
| 2026-02-25 12:05 | docs: add PROJECT_SUMMARY.md | Docs |
| 2026-02-25 11:28 | docs: update CHANGELOG.md | Docs |
| 2026-02-25 11:25 | docs: update AGENTS.md | Docs |
| 2026-02-25 11:15 | feat: add Dialog, Sheet, Sonner components | Feature |
| 2026-02-25 10:59 | feat: use shadcn/ui Card | Feature |
| 2026-02-25 10:51 | feat: update main App with shadcn/ui Button | Feature |
| 2026-02-25 10:49 | feat: update TempleCard with shadcn/ui | Feature |
| 2026-02-25 10:47 | feat: start integrating shadcn/ui | Feature |
| 2026-02-25 10:39 | feat: add shadcn/ui components and Tailwind v4 | Feature |
| 2026-02-25 10:12 | feat: migrate from localStorage to IndexedDB | Feature |
| 2026-02-25 09:59 | docs: translate BACKLOG.md to Russian | Docs |
| 2026-02-25 09:58 | docs: add BACKLOG.md | Docs |
| 2026-02-25 09:46 | docs: add CHANGELOG.md | Docs |
| 2026-02-25 09:43 | docs: add GitHub repo badge | Docs |
| 2026-02-25 09:40 | Initial commit | Init |

### 10.2 Проблемы с коммитами

- ⚠️ **Отсутствие GPG подписи** — все коммиты unsigned
- ⚠️ **Общий email** — `dev@example.com` не соответствует реальному автору
- ✅ **Хорошие сообщения** — следуют conventional commits

### 10.3 Рекомендации

```bash
# Настроить Git
git config --global user.name "Alex Finaev"
git config --global user.email "real@email.com"
git config --global commit.gpgsign true
```

---

## 11. Производительность

### 11.1 Потенциальные проблемы

| Проблема | Решение |
|----------|---------|
| Большие изображения | ✅ Реализовано сжатие |
| Отсутствие lazy loading | Добавить React.lazy() |
| Нет service worker | Добавить PWA support |
| Нет image optimization | Добавить vite-imagetools |

### 11.2 Рекомендации

```typescript
// Lazy loading компонентов
const GeminiGuide = React.lazy(() => import('./components/GeminiGuide'));
const AudioGuidePlayer = React.lazy(() => import('./components/AudioGuidePlayer'));

// Image optimization
import imagetools from 'vite-imagetools';
// vite.config.ts
plugins: [react(), tailwindcss(), imagetools()]
```

---

## 12. Accessibility (a11y)

### 12.1 Анализ

**Положительные аспекты:**
- ✅ Использование Radix UI (a11y-friendly)
- ✅ Семантические HTML элементы
- ✅ `aria-describedby` в Dialog

**Проблемы:**
- ⚠️ Нет явного управления фокусом
- ⚠️ Отсутствует skip-link
- ⚠️ Нет тестов на a11y

### 12.2 Рекомендации

```typescript
// Добавить skip-link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// Добавить axe-core для тестирования
import { axe } from 'jest-axe';
expect(await axe(container)).toHaveNoViolations();
```

---

## 13. Итоговая оценка

### 13.1 Сводная таблица

| Категория | Оценка | Баллы |
|-----------|--------|-------|
| Код-стайл | ⭐⭐⭐⭐ | 8/10 |
| Архитектура | ⭐⭐⭐ | 6/10 |
| Безопасность | ⭐⭐ | 4/10 |
| Тестирование | ⭐ | 2/10 |
| Документация | ⭐⭐⭐⭐ | 8/10 |
| CI/CD | ⭐ | 1/10 |
| Производительность | ⭐⭐⭐ | 6/10 |
| Accessibility | ⭐⭐⭐ | 6/10 |
| **Итого** | **⭐⭐⭐** | **41/80** |

### 13.2 Общий вердикт

**Проект на стадии активной разработки.**

**Сильные стороны:**
- Современный технологический стек (React 19, TypeScript, Vite)
- Хорошая документация
- Чистый код-стайл
- Использование shadcn/ui

**Критические проблемы:**
1. 🔴 Хардкоженный пароль администратора
2. 🔴 API ключ Gemini на клиенте
3. 🔴 Отсутствие лицензии

**Приоритетные улучшения:**
1. Добавить LICENSE файл
2. Перенести API вызовы на backend
3. Настроить CI/CD pipeline
4. Добавить тесты
5. Включить TypeScript strict mode

---

## 14. Рекомендации

### 14.1 Критические (исправить немедленно)

1. **Добавить LICENSE файл**
```markdown
MIT License

Copyright (c) 2026 Alex Finaev

Permission is hereby granted, free of charge...
```

2. **Исправить безопасность API ключа**
```typescript
// Создать backend proxy
// api/gemini.ts (Next.js API route или отдельный сервер)
export default async function handler(req, res) {
  const response = await fetch('https://generativelanguage.googleapis.com/...', {
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
  });
  return res.json(await response.json());
}
```

3. **Исправить .gitignore**
```gitignore
# Добавить
.env
.env.local
.env.*.local
```

### 14.2 Высокий приоритет

1. **Настроить GitHub Actions**
2. **Добавить тесты для компонентов**
3. **Включить TypeScript strict mode**
4. **Настроить pre-commit hooks**

### 14.3 Средний приоритет

1. Рефакторинг компонентов
2. Добавить PWA support
3. Оптимизация изображений
4. Добавить i18n

---

## 15. Заключение

Проект **phanthiet-guardian** представляет собой современное React-приложение с хорошим потенциалом. Использование React 19, TypeScript, Vite и shadcn/ui демонстрирует следование актуальным практикам разработки.

Основные области для улучшения:
- **Безопасность** — критические уязвимости с API ключами и паролями
- **Тестирование** — практически отсутствует
- **CI/CD** — не настроены автоматические проверки

При исправлении критических проблем и внедрении рекомендаций проект может достичь production-ready качества.

---

*Аудит проведён: 2026-03-08*  
*Инструменты: GitHub API, Web Search, Static Analysis*
