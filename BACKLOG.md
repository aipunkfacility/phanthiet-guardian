# Backlog

## 🔴 Critical (Must Fix)

- [ ] **Fix API Key** — `process.env` → `import.meta.env.VITE_GEMINI_API_KEY` в `src/services/gemini.ts`
- [ ] **Sync AI data** — обновить `SYSTEM_INSTRUCTION` в `src/services/gemini.ts` (9 → 5 храмов)

---

## 🟠 High Priority

- [ ] **Fix audio decoding** — исправить парсинг WAV в `src/components/AudioGuidePlayer.tsx`
- [ ] **Add admin protection** — добавить пароль для admin mode в `src/index.tsx`

---

## 🟡 Medium Priority

- [ ] **Pass chat history** — передавать `history` в `chat.sendMessage()` в `src/services/gemini.ts`
- [ ] **Fix keyboard event** — `onKeyPress` → `onKeyDown` в `src/components/GeminiGuide.tsx`
- [ ] **Limit localStorage** — добавить лимит на фото в `src/components/TempleCard.tsx`
- [ ] **Handle image errors** — добавить fallback для изображений в `src/index.tsx`

---

## 🎯 Future

- [ ] Добавить больше храмов в тур
- [ ] Офлайн режим (PWA)
- [ ] Карта с маршрутом
- [ ] Темная тема
