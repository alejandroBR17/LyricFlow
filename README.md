# 🎙️ LyricFlow — Slide & Worship Lyric Formatter

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.2-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

> **LyricFlow** is a high-performance, client-side web application engineered to parse raw song lyrics and transform them into standardized, slide-ready presentation text for church worship teams, AV technicians, and slide operators (**ProPresenter, Holyrics, OpenLP, EasyWorship, PowerPoint**).

---

## ⚡ The Problem It Solves

When preparing songs for stage projection screens, lyrics copied from popular chord websites (Cifra Club, Ultimate Guitar, SongSelect) contain clutter that distracts audiences and breaks slide layouts:

- ❌ Inline bracketed chords: `[Am]`, `(C#m7)`, `[G/B]`, `(F#m7(b5))`, `[C7M]`
- ❌ Harmonic progression lines: `G    D/F#    Em7    C9`
- ❌ Repetition and arrangement markers: `(2x)`, `[3x]`, `(bis)`, `(2 times)`
- ❌ Section tags: `[Verse 1]`, `[Chorus]`, `[Bridge]`, `[Refrão]`, `(Ponte)`, `Intro:`
- ❌ Cluttered metadata & emojis: `Key: G`, `BPM: 68`, `🎵`, `🔴`, `━━━━━━━━━━━━`
- ❌ Inconsistent stanza lengths exceeding projector limits

**LyricFlow** takes any messy input, automatically strips chords and non-lyric notation, enforces an uppercase title, and formats stanzas into optimal **2-line widescreen slides** in under 1 millisecond.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **Real-Time Stream Processing** | Zero-latency instant formatting as you type or paste without server roundtrips. |
| **Bilingual Interface (i18n)** | One-click toggle between **English** and **Portuguese** with localized sample songs. |
| **Interactive 16:9 Slide Simulator** | Test how each slide renders on a live widescreen presentation canvas with arrow keys. |
| **Deep Chord Stripping Engine** | Parses international and Brazilian harmonic notations (`7M`, `m7`, `dim`, `aug`, `sus4`, `b5`). |
| **2-Line Slide Partitioning** | Automates the industry standard 2-lines-per-slide rule for legible stage reading. |
| **Local Persistent History** | Stores the last 20 formatted songs in `localStorage` without requiring user accounts. |
| **Mobile-First Touch Ergonomics** | Swipe-based tab switching, thumb-accessible Floating Action Buttons, and Haptics feedback. |
| **Dark & Light Mode** | Fully synchronized dark/light canvas with zero layout shift. |

---

## 🏗️ Architecture & Engineering Highlights

```
src/
├── components/
│   ├── Header.tsx              # Brand wordmark, i18n switcher, history & theme toggles
│   ├── InputPane.tsx           # Raw lyrics input pane with sample loaders & stats
│   ├── OutputPane.tsx          # Formatted output pane with slide counters & preview trigger
│   ├── SlidePreviewModal.tsx   # Interactive 16:9 projection screen simulator
│   └── HistoryModal.tsx        # Local storage management with slide metrics
├── hooks/
│   └── useLyricsHistory.ts     # Decoupled custom hook for localStorage persistence
├── lib/
│   ├── cleaner.ts              # Core RegEx parsing pipeline & slide chunking algorithm
│   ├── i18n.ts                 # Full bilingual translation dictionary & sample songs
│   ├── utils.ts                # Web Haptics API integration helper
│   └── __tests__/
│       └── cleaner.test.ts     # Unit tests verifying 100% edge cases
├── types/
│   └── index.ts                # Strict domain TypeScript interfaces
├── App.tsx                     # Main layout & state orchestrator
└── main.tsx                    # React 19 entry point
```

### RegEx Parsing Pipeline (`src/lib/cleaner.ts`)
The parsing pipeline executes 6 deterministic normalization stages:
1. **Unicode & Graphical Normalization:** Strips pictographic emojis and divider lines.
2. **Inline & Line Chord Elimination:** Identifies chords using musical root tokens (`[A-G][b#]?`) and qualities (`maj`, `min`, `dim`, `aug`, `sus`, `7M`, `b5`).
3. **Arrangement & Section Cleansing:** Strips section headers and repetition indicators in English and Portuguese.
4. **Stanza Preserving Grouping:** Groups lyrics into semantic blocks without dropping stanzas.
5. **Widescreen Slide Chunking:** Splits stanzas into discrete slides of $N$ lines (default: 2).
6. **Title Normalization:** Enforces uppercase styling and creates standard slide breaks.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** $\ge 18$
- **npm** or **yarn**

### Quickstart

```bash
# 1. Clone repository
git clone https://github.com/your-username/lyricflow.git

# 2. Enter project folder
cd lyricflow

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing

LyricFlow maintains a comprehensive unit test suite powered by **Vitest**:

```bash
# Run unit tests
npm test
```

All 11 unit tests validate:
- Emoji and symbol purging
- Section tags (`[Verse 1]`, `[Chorus]`, `(Bridge)`, `[Refrão]`, `(Ponte)`)
- Repetition markers (`(2x)`, `[3x]`, `bis`)
- Complex chords (`F#m7(b5)`, `C7M`, `D/F#`, `C9`)
- Full English and Portuguese sample songs
- Stanza preservation guarantees

---

## 📜 License

Distributed under the [MIT License](LICENSE).
