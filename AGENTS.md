# AGENTS.md — Guardian of PHAN THIET

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
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test -- src/tests/types.test.ts  # Single file
```

---

## Project Structure

```
/src
  /components    # React components (PascalCase)
  /services     # API clients (Gemini)
  /ui           # shadcn/ui components
  /lib          # Utilities (cn, utils)
  /tests        # Vitest tests
  /utils        # Helper functions (db.ts - IndexedDB)
  types.ts      # Global types (interface, enum)
  constants.ts  # App data (TEMPLES, APP_CONFIG)
  index.tsx     # Entry point
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
- **Sheet** — AI chat panel (right sidebar)
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
- **Photos**: IndexedDB via `src/utils/db.ts` (not localStorage)
- **Custom temples**: localStorage (`custom_temples_data`)
- **Compression**: `browser-image-compression` (500KB max per photo)

### Admin Mode
- Password: `admin123`
- Access: Login button in nav bar
- Toast notifications via Sonner

### shadcn/ui
- Components in `/src/ui/`
- Add new: `npx shadcn@latest add <component>`
- Icons: `lucide-react`

---

## Documentation

- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — Full project documentation (types, API, features, data storage)
- [BACKLOG.md](BACKLOG.md) — Tasks backlog and feature requests
