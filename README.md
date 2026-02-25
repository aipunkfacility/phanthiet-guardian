<div align="center">
<img width="1200" height="475" alt="PHAN THIET" src="https://images.unsplash.com/photo-1590547411364-5f43f07a6a42?auto=format&fit=crop&q=80&w=2000" />
</div>

# Guardian of PHAN THIET

Interactive travel guide for sacred places in Phan Thiet, Vietnam — from Cham towers to fishing villages.

## Quick Start

```bash
npm install
npm run dev
```

## Environment

Create `.env.local`:
```
VITE_GEMINI_API_KEY=your_api_key
```

Get key: https://aistudio.google.com/app/apikey

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run test` | Run tests |

## Tech Stack

- React 19 + TypeScript
- Vite
- Google Gemini API
- TailwindCSS

## Project Structure

```
/src
  /components    # React components
  /services      # API (Gemini)
  /tests        # Vitest tests
  types.ts      # TypeScript types
  constants.ts  # Temple data
  index.tsx    # Entry point
```

## API

- Chat: `gemini-3-flash-preview`
- TTS: `gemini-2.5-flash-preview-tts`
