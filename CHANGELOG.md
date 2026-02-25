# Changelog

All notable changes to this project will be documented in this file.

---

## v1.1.0 - UI & Storage Update

### ✨ New Features

- **Admin Mode**: Protected login with password dialog (password: admin123)
- **AI Chat Sheet**: Gemini AI chat now opens as slide-out panel from right side
- **Toast Notifications**: Beautiful toast messages for user actions using Sonner
- **Dialog Components**: shadcn/ui Dialog for admin login modal

### 🔧 Improvements

- **shadcn/ui Integration**: Added modern accessible components
  - Button, Card, Dialog, Sheet, Sonner
  - Input, Textarea, Label for forms
- **Photo Storage**: Migrated from localStorage to IndexedDB
  - Supports up to 10 photos per temple
  - Automatic image compression (500KB max)
  - Web Worker for non-blocking compression

### 🐛 Fixes

- Fixed Tailwind v4 integration with Vite
- Fixed import paths for shadcn components

### 📚 Documentation

- **AGENTS.md**: Updated with shadcn/ui guidelines
- **llms.txt**: Added UI, lib, utils directories

---

## v1.0.0 - Initial Release

### ✨ New Features

- **React Travel Guide App**: Interactive guide for sacred places in Phan Thiet, Vietnam
- **AI Chat Guide**: Gemini-powered conversational assistant for each temple
- **Audio Guide Player**: Text-to-speech audio tours using Gemini TTS
- **Temple Cards**: Beautiful UI components displaying 5 cultural locations
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

### 🔧 Improvements

- **Project Structure**: Clean architecture with separate components, services, and tests
- **Code Quality**: TypeScript strict typing, ESLint, Prettier configured
- **Testing**: Vitest setup with React Testing Library

### 📚 Documentation

- **AGENTS.md**: Comprehensive developer guidelines for AI agents
- **llms.txt**: Machine-readable documentation index
- **README.md**: Project setup and usage instructions with GitHub badge
