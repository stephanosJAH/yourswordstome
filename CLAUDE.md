# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**YourWordsToMe** is a React web app that generates AI-personalized Bible verses for users. Users authenticate via Google, enter a verse reference, choose a creativity level, and receive a personalized verse they can share as a styled image.

## Commands

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint checks
```

**Cloud Functions (in `functions/` directory):**
```bash
cd functions && npm install   # Install function dependencies
firebase emulators:start      # Run local emulators (Firestore + Functions)
firebase deploy --only functions   # Deploy functions only
firebase functions:secrets:set OPENAI_API_KEY   # Set OpenAI key in Cloud Functions
```

## Architecture

### Frontend (React + Vite)
- **State**: Context API only — `AuthContext` for global auth, `useState` for local UI, real-time Firestore listeners via `useVersesHistory` hook
- **Routing**: React Router v6 with `ProtectedRoute` wrapper that redirects unauthenticated users to `/`
- **Styling**: Tailwind CSS with custom theme (colors, fonts, animations) defined in `tailwind.config.js`

### Backend (Firebase)
- **Authentication**: Google OAuth via Firebase Auth — session persisted automatically
- **Database**: Cloud Firestore — `users/{userId}` doc with `generated_verses` subcollection
- **AI generation**: Handled entirely inside a Firebase Cloud Function (`generateVerse`) in `functions/index.js`, not on the client. This keeps API keys server-side.

### Service Layer (`src/services/`)
Each file owns one domain. When adding features, extend the appropriate service rather than calling Firebase/APIs directly from components.

| File | Responsibility |
|------|---------------|
| `authService.js` | Google sign-in/out, create user doc on first login |
| `userService.js` | Token management, unlimited access check |
| `bibleService.js` | scripture.api.bible integration + fallback hardcoded verses |
| `verseGeneratorService.js` | Calls the `generateVerse` Cloud Function |
| `verseHistoryService.js` | CRUD for `generated_verses` subcollection |

### AI Provider Pattern (`src/services/ai/`)
Uses a factory + abstract base class pattern. `AIProviderFactory` creates instances; `OpenAIProvider` is active. `ClaudeProvider` is ready but not wired up. To add a new provider: extend `AIProvider.js`, register in `AIProviderFactory.js`.

### Visual Styles (`src/components/visual/`)
Three self-contained style components (`ClassicStyle`, `ModernStyle`, `InspirationalStyle`) rendered on `ResultPage`. Each receives verse data as props and handles its own layout and export via `html2canvas`.

## Key Data Flows

**Verse generation flow:**
1. `Dashboard.jsx` validates reference format (regex: `/^[1-3]?\s*[a-záéíóúñ]+\s+\d+:\d+(-\d+)?$/i`)
2. Calls `verseGeneratorService.js` → Firebase Cloud Function `generateVerse`
3. Cloud Function: verifies tokens → fetches Bible text → calls OpenAI GPT-4 → decrements token → saves to Firestore
4. Result navigated to `ResultPage` via router state

**Token system:** Each user gets 5 tokens on signup. `UNLIMITED_ACCESS_EMAIL` in `functions/index.js` bypasses token checks.

## Environment Variables

Create `.env` in project root (all prefixed `VITE_` for Vite exposure):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_BIBLE_API_KEY=          # Free at scripture.api.bible/signup
VITE_BIBLE_TRANSLATION_ID=592420522e16049f-01   # Reina Valera 1909 (default)
```

The OpenAI key is **not** a frontend env var — it lives as a Firebase secret (`OPENAI_API_KEY`) accessed only in Cloud Functions.

## Firestore Schema

```
users/{userId}
  displayName, email, photoURL, tokens, totalGenerated, createdAt, lastGeneratedAt

  generated_verses/{docId}
    verseReference, originalText, personalizedText, isFavorite, createdAt
```

Security rules enforce that users can only read/write their own documents (`request.auth.uid == userId`).
