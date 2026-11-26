# القرآن الكريم — kavkazislam.com

A modern Quran reading and listening site in Arabic and Russian, built with Next.js.

**Live:** https://kavkazislam.com

## Features

- **Reading:** all 114 surahs, prerendered as static pages, with a card view and a mushaf view
- **Translation:** Russian translation by Elmir Kuliev
- **Tafsir:** per-verse tafsir loaded on demand (al-Muyassar in Arabic, al-Sa'di in Russian)
- **Audio:** five reciters, gapless verse-by-verse playback, lock-screen controls
- **Memorisation:** repeat each verse 2–10 times or indefinitely
- **Themes:** light, dark and sepia (paper) modes
- **Reading position:** resumes from the last verse read
- **Sharing:** export a verse as an image
- **SEO:** per-surah metadata, `sitemap.xml` and `robots.txt`

## Tech stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS 4: theme tokens live in `src/app/globals.css`
- Data: [Quran.com API v4](https://api-docs.quran.com/) for text, translation and tafsir; [EveryAyah](https://everyayah.com/) for audio
- Fonts: Amiri Quran (Quran text), IBM Plex Sans Arabic (UI)

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build; fetches all 114 surahs from Quran.com
npm run lint
```

## Deployment (Windows shared hosting)

The site runs behind IIS on Windows shared hosting, which starts it with `node start.js` through HttpPlatformHandler. The host has no npm and no shell, so the site is built and packaged locally:

```bash
npm run deploy   # builds, then assembles `deploy/`
```

Upload the **contents of `deploy/`** (including the `.next` folder) to the site root, after clearing the previous upload and its `web.config`.

- **502 error:** open `logs\node_*.log` in the site root. Its first line is the Node version (Next.js 16 needs 20.9 or newer), followed by the startup error.
- **Local check:** `deploy/` is self-contained, so `node deploy/start.js` runs it as the host does (`PORT` defaults to 3000).
- `npm start` still serves the site locally but warns about the standalone output.

## Project structure

```
src/
  app/                 routes (/, /surahs, /surah/[id], /search), sitemap, robots
  components/          UI: audio, layout, reading, surah, ui
  context/             theme, language, audio and reading-position providers
  hooks/               useStoredValue: hydration-safe localStorage
  lib/                 quran-api (server fetch), tafsir (client fetch), site config
  data/surahs.ts       surah metadata (name, verse count, type, juz)
```

The site domain is set in `src/lib/site.ts`.
