# Project Summary — Guardian of PHAN THIET

## 1. Project Overview

**Project Name**: Guardian of PHAN THIET  
**Type**: Interactive Travel Guide Web Application  
**Core Functionality**: Cultural tourism guide for Phan Thiet, Vietnam — interactive temple route planner with AI-powered guide, audio narration, and personal photo album.

---

## 2. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.2.4 |
| Language | TypeScript | 5.8.2 |
| Bundler | Vite | 6.2.0 |
| Styling | Tailwind CSS | 4.2.1 |
| UI Library | shadcn/ui | 3.8.5 |
| Icons | lucide-react | 0.575.0 |
| AI | Google Gemini API | @google/genai 1.39.0 |
| Testing | Vitest | 2.1.0 |
| Linting | ESLint | 9.10.0 |
| Formatting | Prettier | 3.3.3 |
| Image Compression | browser-image-compression | 2.0.2 |
| Animations | tw-animate-css | 1.4.0 |

---

## 3. Directory Structure

```
/src
├── /components          # React components
│   ├── TempleCard.tsx           # Temple detail card with photos & editing
│   ├── GeminiGuide.tsx          # AI guide (chat with Gemini)
│   └── AudioGuidePlayer.tsx     # Audio player for TTS narration
│
├── /services            # API clients
│   └── gemini.ts                # Gemini API (chat + TTS)
│
├── /ui                  # shadcn/ui components
│   ├── button.tsx               # Button
│   ├── card.tsx                 # Card
│   ├── dialog.tsx               # Dialog (modals)
│   ├── sheet.tsx                # Sheet (side panel)
│   ├── sonner.tsx               # Toaster (notifications)
│   ├── input.tsx                # Input
│   ├── textarea.tsx             # Textarea
│   └── label.tsx                # Label
│
├── /lib                 # Utilities
│   └── utils.ts                 # cn() for tailwind-merge
│
├── /utils               # Helper functions
│   ├── db.ts                    # IndexedDB for photo storage
│   └── importExport.ts          # Export/import temple data
│
├── /tests              # Vitest tests
│   ├── constants.test.ts        # Constants tests
│   ├── types.test.ts            # Types tests
│   └── setup.ts                 # Test setup
│
├── types.ts             # Global types
├── constants.ts         # App constants (TEMPLES, APP_CONFIG)
├── index.tsx            # Main App component
└── index.css            # Global styles (Tailwind v4 + shadcn)
```

---

## 4. Key Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript: ES2022, jsx: react-jsx, path aliases (@/*) |
| `vite.config.ts` | Dev server port 3000, react + tailwindcss plugins, @/ alias |
| `components.json` | shadcn/ui config: style "new-york", tsx, aliases |
| `prettier.config.js` | Code formatting |
| `eslint.config.js` | Linting rules |
| `vitest.config.ts` | Test configuration |
| `.env.local` | Secrets storage (VITE_GEMINI_API_KEY) |

---

## 5. Main Components

### App (index.tsx)
Main page layout with:
- Hero section with dynamic greeting based on time of day
- Timeline sidebar with calculated schedule
- Temple cards grid
- AI Guide toggle button
- Admin mode panel
- Google Maps route builder

### TempleCard
- Displays temple details: image, name, culture, history
- Audio guide player integration
- User photo album (upload/delete)
- Admin editing mode (edit all fields)
- Google Maps link

### GeminiGuide
- Chat interface with AI guide (Sheet component)
- System prompt: "Хранитель историй Фантьета"
- Context-aware responses about temples and legends

### AudioGuidePlayer
- TTS audio generation via Gemini
- Web Audio API for playback
- Play/pause controls
- Status indicators (loading, playing, error)

---

## 6. API Services

### Gemini Service (services/gemini.ts)

| Method | Model | Description |
|--------|-------|-------------|
| `getGeminiGuideResponse(message, history)` | gemini-3-flash-preview | Chat with AI guide, contextual tour information |
| `generateAudio(text)` | gemini-2.5-flash-preview-tts | Text-to-speech audio generation |

**API Key**: `import.meta.env.VITE_GEMINI_API_KEY` (not process.env)

---

## 7. Utilities

### IndexedDB (utils/db.ts)

| Function | Purpose |
|----------|---------|
| `initDB()` | Initialize IndexedDB |
| `savePhotos(templeId, photos)` | Save compressed photos |
| `getPhotos(templeId)` | Retrieve photos |
| `deletePhotos(templeId)` | Remove photos |
| `compressImage(file)` | Compress image (max 800px, 500KB) |
| `migrateFromLocalStorage(templeIds)` | Migrate legacy localStorage data |

**Limits**: MAX_PHOTOS = 10, MAX_SIZE_MB = 0.5, MAX_WIDTH = 800px

### Import/Export (utils/importExport.ts)

| Function | Purpose |
|----------|---------|
| `exportTemples(temples)` | Export to JSON file |
| `importTemples(file)` | Import from JSON file |
| `getInitialTemples()` | Get default temples |

### Lib (lib/utils.ts)

| Function | Purpose |
|----------|---------|
| `cn(...inputs)` | Merge tailwind classes |

---

## 8. Data Types (types.ts)

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

---

## 9. Constants (constants.ts)

### TEMPLES
Array of 5 temples:

1. **Ван Туй Ту** (Van Thuy Tu Temple) — Vietnamese, whale skeleton
2. **Храм Гуань Юя** (Chinese Assembly Hall) — Chinese, oldest temple
3. **Водонапорная башня** (Water Tower) — History, night illumination
4. **Башни Пошану** (Po Sah Inu Towers) — Cham, Hindu, IX century
5. **Рыбацкая деревня** (Mui Ne Fishing Village) — Vietnamese, sunset

### APP_CONFIG
```typescript
{
  TITLE: 'Phan Thiết: Путь Хранителя',
  SUBTITLE: 'Маршрут, оживающий во времени',
  TRIPSTER_URL: 'https://experience.tripster.ru/experience/98200/',
}
```

---

## 10. Key Features

- **Adaptive Route**: Calculates schedule based on current time of day
- **Admin Mode**: Edit temple data (password: `admin123`)
- **Google Maps Route**: Builds driving route through all temples
- **User Photos**: IndexedDB storage with compression (10 photos max)
- **AI Guide**: Gemini-powered chat with tour context
- **TTS Audio**: Generate audio narration via Gemini
- **Export/Import**: JSON backup for temple data
- **Dynamic Timeline**: Morning / Current / Tomorrow modes

---

## 11. Scripts

```bash
npm run dev           # Dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run typecheck    # TypeScript check
npm run test         # Run tests
npm run test:watch   # Watch mode
```

---

## 12. Admin Credentials

- **Password**: `admin123`
- **Access**: Login button in navigation bar
- **Features**: Edit temple data, export/import JSON

---

## 13. Data Storage

| Data Type | Storage Method |
|-----------|---------------|
| User photos | IndexedDB (db.ts) |
| Custom temples | localStorage (`custom_temples_data`) |
| API secrets | `.env.local` (VITE_GEMINI_API_KEY) |
| Default data | `constants.ts` (TEMPLES) |

---

Last updated: 2026-02-25
