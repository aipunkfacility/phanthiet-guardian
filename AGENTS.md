# AGENTS.md — Храмы Фантьета

> Context: React 19 | TypeScript | Vite | Gemini API | TailwindCSS | shadcn/ui

---

## 🚨 CRITICAL

- **NO** `process.env` in browser code — use `import.meta.env.VITE_GEMINI_API_KEY`
- **NO** secrets in code — use `.env.local`
- **NO** `any` — use `unknown` or explicit types

---

## Commands (PRIMARY)

```bash
npm run dev           # Dev server (port 3000)
npm run build         # Production build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
npm run typecheck     # TypeScript check (tsc --noEmit)
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test -- src/tests/types.test.ts  # Single file
```

---

## Project Structure

```
/src
  /components
    /layout         # Navbar, Header, Footer, FloatingButtons
    /schedule       # Schedule, Timeline, SunsetIndicator
    /admin          # AdminLoginDialog, AdminPanel, AdminModeBanner
    /temple         # TempleCard, TempleCardView, TempleCardEdit, TempleGallery
  /hooks            # useTempleData, useAdmin, useSchedule, usePhotos, useGemini, useAudio
  /services         # Gemini API client
  /utils            # db, scheduleCalculations, audioDecoder, formatters
  /ui               # shadcn/ui components
  /tests            # Vitest tests
  types.ts          # Global types
  constants.ts      # Temple data (TEMPLES, APP_CONFIG)
  App.tsx           # Main component
  index.tsx         # Entry point
```

---

## Code Style

### Imports Order
1. React core
2. External libraries
3. shadcn/ui components
4. Internal components
5. Internal services/utils
6. Types
7. Constants

### shadcn/ui Components
- **Button** — all buttons
- **Card** — temple cards in list, info sections
- **Dialog** — admin login modal
- **Sonner** — toast notifications
- **Input/Textarea/Label** — form fields

### Naming
| Type | Convention |
|------|------------|
| Components | PascalCase (`TempleCard.tsx`) |
| Hooks | camelCase + `use` (`useTempleData.ts`) |
| Types/Enums | PascalCase (`Temple`, `TempleCulture`) |
| Constants | SCREAMING_SNAKE (`MAX_PHOTOS`) |

### Rules
- **No comments** — unless user explicitly asks
- **One component per file** — default export
- **Max line** — 100 chars (Prettier)
- **Avoid** `any`, use `unknown`
- **Tailwind** — semantic colors, responsive prefixes

---

## Custom Hooks

- **useTempleData** — CRUD операции с храмами, localStorage синхронизация
- **useAdmin** — админ-аутентификация, sessionStorage
- **useSchedule** — расписание, построение маршрута
- **usePhotos** — загрузка/удаление фото в IndexedDB
- **useGemini** — Gemini API с кешированием и retry
- **useAudio** — Web Audio API плеер

---

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { TEMPLES } from './constants';

describe('Temple', () => {
  it('should have required fields', () => {
    expect(TEMPLES[0].id).toBeDefined();
  });
});
```

---

## Important Notes

### Gemini API
- Key: `import.meta.env.VITE_GEMINI_API_KEY`
- Model: `gemini-3-flash-preview` (chat), `gemini-2.5-flash-preview-tts` (TTS)

### Data Storage
- **Photos**: Store in `public/images/` folder, reference as `/filename.jpg`
- **Temples**: Always use `constants.ts` (TEMPLES) - no localStorage for temples
- **User photos**: IndexedDB via `src/utils/db.ts`
- **Compression**: `browser-image-compression` (500KB max per photo)

### Admin Mode
- Password: `admin123`
- Access: Login button in nav bar
- Toast notifications via Sonner

### shadcn/ui
- Components in `/src/ui/`
- Add new: `npx shadcn@latest add <component>`
- Icons: `lucide-react`

### Design Tokens (index.css)
- **Semantic colors**: Use CSS variables (`--primary`, `--muted`, etc.) instead of Tailwind defaults
- **Glass effects**: `.glass-card` and `.glass-card-light` classes available
- **Typography**: Use rem-based sizing, no hardcoded px values for text

### Fonts
- **Inter** — headings (via Google Fonts)
- **Plus Jakarta Sans** — body text (via Google Fonts)
- Import in `index.html`

---

## Documentation

- [CHANGELOG.md](CHANGELOG.md) — Version history
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — Full project documentation
- [BACKLOG.md](BACKLOG.md) — Tasks backlog and feature requests
