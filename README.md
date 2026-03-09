<div align="center">
<img width="1200" height="475" alt="PHAN THIET" src="https://images.unsplash.com/photo-1590547411364-5f43f07a6a42?auto=format&fit=crop&q=80&w=2000" />
</div>

[![GitHub Repo](https://img.shields.io/badge/GitHub-phanthiet--guardian-blue?style=flat-square&logo=github)](https://github.com/aipunkfacility/phanthiet-guardian)
[![CI](https://github.com/aipunkfacility/phanthiet-guardian/actions/workflows/ci.yml/badge.svg)](https://github.com/aipunkfacility/phanthiet-guardian/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

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
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run tests |

## Tech Stack

- React 19 + TypeScript
- Vite
- Google Gemini API
- TailwindCSS
- shadcn/ui

## Project Structure

```
/src
  /components
    /layout      # Navbar, Header, Footer, FloatingButtons
    /schedule    # Schedule, Timeline, SunsetIndicator
    /admin       # AdminLoginDialog, AdminPanel
    /temple      # TempleCard, TempleCardView, TempleCardEdit, TempleGallery
  /hooks         # useTempleData, useAdmin, useSchedule, usePhotos, useGemini, useAudio
  /services      # Gemini API client
  /utils         # db, scheduleCalculations, audioDecoder, formatters
  /ui            # shadcn/ui components
  types.ts       # TypeScript types
  constants.ts   # Temple data
  App.tsx        # Main component
  index.tsx      # Entry point
```

## API

- Chat: `gemini-3-flash-preview`
- TTS: `gemini-2.5-flash-preview-tts`

## Documentation

- [CHANGELOG.md](CHANGELOG.md) — Version history
- [AGENTS.md](AGENTS.md) — Developer guidelines
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) — Full project documentation
- [BACKLOG.md](BACKLOG.md) — Tasks backlog
