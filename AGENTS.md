# AGENTS.md — Guardian of PHAN THIET

> Context: React 19 | TypeScript | Vite | Gemini API | TailwindCSS

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
  /services      # API clients
  /tests        # Vitest tests
  types.ts      # Global types (interface, enum)
  constants.ts  # App data (TEMPLES, APP_CONFIG)
  index.tsx     # Entry point
```

---

## Code Style

### Imports Order
1. React core
2. External libraries
3. Internal components
4. Internal services/utils
5. Types
6. Constants

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
- **Tailwind** — semantic colors (`text-stone-900`), responsive (`md:w-64`)

---

## Testing

```typescript
import { describe, it, expect } from 'vitest';
import { TEMPLES } from '../constants';

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

### LocalStorage
- Always wrap `JSON.parse` in try/catch
- Limit stored data (5MB browser limit)

### Admin Mode
- Unprotected — consider password protection
