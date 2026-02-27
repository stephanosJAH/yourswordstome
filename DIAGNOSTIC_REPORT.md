# Diagnostic Report: YourWordsToMe

> Generated: 2026-02-25

---

## 1. Code Quality & Consistency

### Anti-patterns & deprecated code still in use

**[Dashboard.jsx:108](src/pages/Dashboard.jsx#L108)** calls the deprecated `getVerseGeneratorService()` singleton, which logs a console warning on every use. The plain `generatePersonalizedVerse()` function from the same module exists specifically to replace it.

**[verseGeneratorService.js:57-76](src/services/verseGeneratorService.js#L57-L76)** — The `VerseGeneratorService` class is marked `@deprecated` but is still the active code path. Remove the class entirely and update Dashboard to import `generatePersonalizedVerse` directly.

### Duplicated helper

`getFirstName()` is copy-pasted identically in [Dashboard.jsx:36-39](src/pages/Dashboard.jsx#L36-L39) and [ResultPage.jsx:146-149](src/pages/ResultPage.jsx#L146-L149). Extract to `src/utils/nameUtils.js`.

### Service layer boundary broken in the hook

[useVersesHistory.js](src/hooks/useVersesHistory.js) imports `collection`, `query`, `onSnapshot`, `orderBy`, `where`, `limit` directly from `firebase/firestore` and constructs Firestore queries inline. This is exactly the pattern the service layer is designed to avoid. The query logic should live in `verseHistoryService.js`, and the hook should call it.

### Empty try/catch wrappers

[AuthContext.jsx:46-55](src/contexts/AuthContext.jsx#L46-L55) — `login()` and `logout()` catch errors only to re-throw them. These wrappers add no value.

### Debug console.logs left in production code

- [AuthContext.jsx:60-61](src/contexts/AuthContext.jsx#L60-L61) — `console.log('Refrescando datos...')` and `console.log('Datos actualizados:', data)` log user data objects.
- [verseHistoryService.js:46](src/services/verseHistoryService.js#L46), [userService.js:72](src/services/userService.js#L72) — success log lines.
- [functions/index.js](functions/index.js) — Acceptable in Cloud Functions since they go to Cloud Logging, not the browser.

---

## 2. Firebase & Security

### Firestore rules are solid ✅

The rules in [firestore.rules](firestore.rules) are well-designed:
- User isolation enforced (`request.auth.uid == userId`)
- `generated_verses` creation blocked from client — only Cloud Functions (Admin SDK) can write
- Client updates to `tokens`, `totalGenerated`, `lastGeneratedAt`, `email` are blocked
- `isFavorite` is the only field clients can update on verses
- Default deny-all catch-all

### UNLIMITED_ACCESS_EMAIL is exposed client-side

[userService.js:6](src/services/userService.js#L6) hardcodes the admin email and exports `hasUnlimitedAccess()`. This is imported into [Dashboard.jsx:6](src/pages/Dashboard.jsx#L6) and bundled into the client JS — any user can open DevTools and see `estebanicamp@gmail.com`. The client-side check is only cosmetic (UI display), so the actual security is the server-side check in [functions/index.js:22](functions/index.js#L22). Consider moving the UI check to read `isUnlimited` from the Cloud Function response instead.

### `saveVerse()` with `updateStats: true` is broken by design

[verseHistoryService.js:56-68](src/services/verseHistoryService.js#L56-L68) contains client-side token decrement logic (`tokens: increment(-1)`). The Firestore rules explicitly block client-side writes to `tokens`. Calling this code path from the browser will always throw a permission error. This option is dead code — the Cloud Function handles all token decrement atomically.

### `saveToHistory()` in userService writes to a read-only subcollection

[userService.js:81-93](src/services/userService.js#L81-L93) writes to `users/{userId}/history/{docId}`, but the Firestore rules set `allow create, update, delete: if false` on that subcollection. This function will always fail with a permission error. Dead/broken code.

### No input length limits in the Cloud Function

[functions/index.js:375-394](functions/index.js#L375-L394) validates type and emptiness but no max length. A user can send a `userName` of arbitrary length that gets injected into the OpenAI prompt:

```js
// Add after the existing type checks:
if (userName.trim().length > 50) {
  throw new HttpsError("invalid-argument", "El nombre es demasiado largo.");
}
if (verseReference.length > 100) {
  throw new HttpsError("invalid-argument", "La referencia es demasiado larga.");
}
```

### No rate limiting on the Cloud Function

There is no Firebase App Check, no per-user request throttle, and no IP-level rate limit. An unlimited-access user faces zero throttle. Even normal users can hammer the endpoint (tokens will be decremented, but the OpenAI bill accumulates on every call before the transaction commits). Consider adding [Firebase App Check](https://firebase.google.com/docs/app-check) or a Firestore-based per-minute counter.

### `VITE_BIBLE_API_KEY` is exposed but effectively unused

[bibleService.js](src/services/bibleService.js) uses `import.meta.env.VITE_BIBLE_API_KEY` and calls `scripture.api.bible` client-side. However, `Dashboard.jsx` only imports `validateReference` from this service — the actual verse fetching happens in [functions/index.js](functions/index.js) via `bible-api.com` (no key required). The client-side fetch path is dead code, so the key exposure is a non-issue in practice — but it also means `VITE_BIBLE_API_KEY` and `VITE_BIBLE_TRANSLATION_ID` are unnecessary env vars.

---

## 3. AI Provider Pattern

### The entire `src/services/ai/` directory is dead code

`AIProviderFactory`, `OpenAIProvider`, and `ClaudeProvider` are never called anywhere in the current flow. Generation goes directly through `verseGeneratorService.js` → Firebase Cloud Function → OpenAI inside the function. The factory pattern exists but has no callers.

### ClaudeProvider — what's needed to activate it

[ClaudeProvider.js](src/services/ai/ClaudeProvider.js) is structurally correct (right headers, right response parsing `data.content[0].text`). To actually activate it you would need to:

1. Update [functions/index.js](functions/index.js) to use the Anthropic SDK (`@anthropic-ai/sdk`) instead of `openai`, since all production AI calls happen in the Cloud Function. The client-side `ClaudeProvider` can't be used without exposing an Anthropic key to the browser.
2. The model ID `claude-sonnet-4-20250514` on [ClaudeProvider.js:8](src/services/ai/ClaudeProvider.js#L8) should be `claude-sonnet-4-5` (the correct versioned ID format).

### Switching providers requires only changing `functions/index.js`

Since the client AI providers are unused, switching from GPT-4o-mini to Claude means updating `generateWithOpenAI()` in [functions/index.js:310-343](functions/index.js#L310-L343) and adding an Anthropic secret. The factory pattern in `src/services/ai/` would only become relevant if AI calls were ever moved back to the client (which would be a security regression).

---

## 4. Feature Completeness

### Critical: Navigation guard on ResultPage is commented out

[ResultPage.jsx:160-167](src/pages/ResultPage.jsx#L160-L167):

```js
// Comentado temporalmente para desarrollo - descomentar en producción
// React.useEffect(() => {
//   if (!verseData) {
//     navigate('/dashboard');
//   }
// }, [verseData, navigate]);
// if (!verseData) return null;
```

This is deployed to production. Any user navigating directly to `/result` sees the hardcoded `DUMP_VERSE_DATA` test verse ("Porque de tal manera amó Dios al mundo...") with a fake "Juan 3:16" reference. Uncomment the guard and remove `DUMP_VERSE_DATA`.

### Stray `ñ` character in App.jsx

[App.jsx:53](src/App.jsx#L53) — there is a literal `ñ` after `</ProtectedRoute>`. This is syntactically valid JSX (it becomes a text node) but is clearly unintentional.

### `useFavoriteVerses` is exported but never used

[useVersesHistory.js:108-120](src/hooks/useVersesHistory.js#L108-L120) — exported but not imported anywhere. Dead export.

### `personalizedText` field not saved by `saveVerse()`

[verseHistoryService.js:29-35](src/services/verseHistoryService.js#L29-L35) saves `verseReference`, `originalText`, `isFavorite`, and `createdAt` — but **not `personalizedText`**. The Cloud Function correctly saves all fields including `personalizedText`. The client-side `saveVerse()` function (already dead code) would lose the personalized text if ever called.

---

## 5. Performance

### AuthContext value object causes cascading re-renders

[AuthContext.jsx:70-77](src/contexts/AuthContext.jsx#L70-L77) creates a new `value` object on every render:

```js
const value = { user, userData, loading, login, logout, refreshUserData };
```

Since `login` and `logout` are declared as `async` functions inside the component body without `useCallback`, they get new references every render. Every component consuming `useAuth()` re-renders whenever `AuthContext` re-renders. Wrap `value` in `useMemo` and functions in `useCallback`.

### `useVersesHistory` re-subscribes when `limitCount` changes reference

[useVersesHistory.js:25](src/hooks/useVersesHistory.js#L25) — `limitCount` is in the `useEffect` dependency array. If a parent passes an inline number literal, this is fine, but if it passes an expression that recalculates (e.g., from state), it causes unnecessary listener re-subscriptions.

### `useFavoriteVerses` causes an extra re-render cycle

[useVersesHistory.js:113-116](src/hooks/useVersesHistory.js#L113-L116) calls `result.setFavoritesOnly(true)` in a `useEffect` with empty `[]` deps. This means the hook mounts with `favoritesOnly = false` (triggering one Firestore subscription), then immediately sets `favoritesOnly = true` (tearing down and creating a second subscription). Should initialize `favoritesOnly` as `true` directly.

### `html2canvas` not lazy-loaded

[ResultPage.jsx:6](src/pages/ResultPage.jsx#L6) — `html2canvas` (~200KB) is imported statically. It's only used on download/share button click. Use dynamic `import('html2canvas')` inside `handleDownload` and `handleShare`.

### `ModernStyle` external image will fail in html2canvas

[ModernStyle.jsx:10-13](src/components/visual/ModernStyle.jsx#L10-L13) loads a background image from `images.unsplash.com`. html2canvas is called with `useCORS: true` but Unsplash's CDN does not send permissive CORS headers for cross-origin canvas rendering. The downloaded image will likely be blank or throw a security error for the Modern style. The image should be bundled as a local asset.

---

## 6. Error Handling

### ResultPage error handling is inconsistent

- [ResultPage.jsx:212-215](src/pages/ResultPage.jsx#L212-L215) — `handleDownload` catch uses `alert()`. The rest of the app uses styled inline error states.
- [ResultPage.jsx:235-238](src/pages/ResultPage.jsx#L235-L238) — `handleShare` silently swallows errors (only `console.error`). Users get no feedback.
- [ResultPage.jsx:138-140](src/pages/ResultPage.jsx#L138-L140) — `handleToggleFavorite` only `console.error`s on failure. User sees no feedback when a favorite toggle fails.

### `functions/not-found` not mapped in verseGeneratorService

[verseGeneratorService.js:30-53](src/services/verseGeneratorService.js#L30-L53) maps `unauthenticated`, `resource-exhausted`, and `invalid-argument`, but not `not-found`. If the user's Firestore document doesn't exist (e.g., was manually deleted), the error falls through to the generic message.

### Bible API fallback works correctly ✅

[bibleService.js:134-145](src/services/bibleService.js#L134-L145) — `getFallbackVerse` normalizes accents and spaces before comparing. The normalization logic is correct. If the reference isn't in the fallback list, it throws a user-friendly Spanish error message that will display in Dashboard's error state.

---

## 7. Missing Pieces Summary

| Gap | Location | Severity |
|-----|----------|----------|
| Navigation guard commented out, test data visible at `/result` | [ResultPage.jsx:160-167](src/pages/ResultPage.jsx#L160-L167) | **High** |
| No rate limiting on `generateVerse` Cloud Function | [functions/index.js](functions/index.js) | **High** |
| No input length validation (prompt injection risk) | [functions/index.js:375](functions/index.js#L375) | **Medium** |
| No error boundaries — JS errors crash blank screen | Entire app | **Medium** |
| ModernStyle image will fail in html2canvas export | [ModernStyle.jsx:10](src/components/visual/ModernStyle.jsx#L10) | **Medium** |
| Stray `ñ` in App.jsx | [App.jsx:53](src/App.jsx#L53) | **Low** |
| `html2canvas` not lazy-loaded | [ResultPage.jsx:6](src/pages/ResultPage.jsx#L6) | **Low** |
| AuthContext value not memoized | [AuthContext.jsx:70](src/contexts/AuthContext.jsx#L70) | **Low** |
| `saveToHistory()` writes to read-only subcollection | [userService.js:81](src/services/userService.js#L81) | **Low** (dead code) |
| Deprecated `VerseGeneratorService` still in use | [Dashboard.jsx:108](src/pages/Dashboard.jsx#L108) | **Low** |
| Zero tests | Entire codebase | — |

---

## Priority Fix Order

1. **Uncomment the `ResultPage` navigation guard** and remove `DUMP_VERSE_DATA` — test data is visible in production right now.
2. **Bundle `ModernStyle` background image locally** — downloads for the Modern style produce blank PNGs due to Unsplash CORS restrictions.
3. **Add input length limits** to `generateVerse` Cloud Function — prevents prompt injection via long `userName`.
4. **Add a rate limit** to the Cloud Function — protects OpenAI spend for unlimited-access users.
5. **Remove dead code** — `VerseGeneratorService` class, `saveToHistory()`, `useFavoriteVerses`, client-side AI providers.
