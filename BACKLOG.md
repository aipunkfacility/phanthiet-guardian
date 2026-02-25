# Бэклог

## 🔴 Критические (Срочно исправить)

- [ ] **Исправить API Key** — `process.env` → `import.meta.env.VITE_GEMINI_API_KEY` в `src/services/gemini.ts` (пока не актуально)
- [ ] **Синхронизировать данные ИИ** — обновить `SYSTEM_INSTRUCTION` в `src/services/gemini.ts` (9 → 5 храмов) (будет 9, пока 5)

---

## 🟠 Высокий приоритет

- [ ] **Исправить декодинг аудио** — исправить парсинг WAV в `src/components/AudioGuidePlayer.tsx`
- [ ] **Защита админа** — добавить пароль для admin mode в `src/index.tsx`

---

## 🟡 Средний приоритет

- [ ] **Передавать историю чата** — передавать `history` в `chat.sendMessage()` в `src/services/gemini.ts`
- [ ] **Исправить событие клавиатуры** — `onKeyPress` → `onKeyDown` в `src/components/GeminiGuide.tsx`
- [ ] **Лимит localStorage** — добавить ограничение на фото в `src/components/TempleCard.tsx`
- [ ] **Обработка ошибок изображений** — добавить fallback для изображений в `src/index.tsx`

---

## 🎯 Будущее

- [ ] Добавить больше храмов в тур
- [ ] Офлайн режим (PWA)
- [ ] Карта с маршрутом
- [ ] Тёмная тема
