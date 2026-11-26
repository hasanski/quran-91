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

## Deployment

The host builds the site from the `main` branch of the GitHub repository itself, with build command `npm run build` and start command `npm run start`, so nothing is uploaded by hand.

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
