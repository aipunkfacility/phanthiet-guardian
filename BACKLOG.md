# Бэклог

## 🔴 Критические (Срочно исправить)

- [x] **Исправить API Key** — `process.env` → `import.meta.env.VITE_GEMINI_API_KEY` через Vite Proxy (`/api/gemini`)
- [x] **CI/CD** — GitHub Actions с lint, typecheck, test, build
- [x] **Rate Limiting** — лимит запросов к Gemini API (10/минута)
- [x] **Pre-commit Hooks** — Husky + lint-staged
- [x] **Исправить тесты** — моки AudioContext и IndexedDB для CI

---

## 🟠 Высокий приоритет

- [x] **Исправить декодинг аудио** — исправить парсинг WAV в `src/components/AudioGuidePlayer.tsx`
- [ ] **Синхронизировать данные ИИ** — обновить `SYSTEM_INSTRUCTION` в `src/services/gemini.ts` (9 → 5 храмов)

---

## 🟡 Средний приоритет

- [ ] **Production: Backend для Gemini API** — Vite Proxy работает только в dev. Для GitHub Pages нужен Edge Function (Vercel/Cloudflare) или другой backend
- [ ] **Обработка ошибок изображений** — добавить fallback для изображений в `src/index.tsx`
- [ ] **Рефакторинг архитектуры** — вынести логику в кастомные хуки (useTempleData, useGemini, useAudio), разделить index.tsx
- [ ] **Оптимизация производительности** — React.lazy(), оптимизация изображений
- [ ] **Accessibility (a11y)** — добавить skip-link, улучшить управление фокусом, тесты axe-core

---

## 🎯 Будущее

- [ ] Добавить больше храмов в тур
- [ ] Карта с маршрутом
- [ ] Тёмная тема
- [ ] [x] Добавить тесты для компонентов
- [ ] Обновить документацию (README, CONTRIBUTING.md, скриншоты)

---

## ✅ Выполнено

- [x] **Защита админа** — пароль для admin mode (`admin123`)
- [x] **Передавать историю чата** — передаётся в `chat.sendMessage()`
- [x] **Исправить событие клавиатуры** — `onKeyPress` → `onKeyDown`
- [x] **Лимит localStorage** — ограничение на фото (MAX_PHOTOS = 10)
- [x] **CI/CD Pipeline** — GitHub Actions (lint, typecheck, test, build)
- [x] **Rate Limiting** — 10 запросов/минута для Gemini API
- [x] **Pre-commit Hooks** — Husky + lint-staged
- [x] **Исправлены тесты** — моки AudioContext, IndexedDB для CI
