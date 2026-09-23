import { CleanOptions } from '../types';

/**
 * Standard chord matching pattern covering standard and Brazilian/Latin notation:
 * E.g., C, C#m, Dbm7, F#m7(b5), C7M, G4, A9, Bb/D, Em(add9), Gsus4, etc.
 */
const CHORD_TOKEN =
  '[A-G][b#]?(?:m|maj|min|dim|aug|sus|M)?(?:2|4|5|6|7|9|11|13|7M|M7)?(?:\\([b#]?[0-9]+\\))?(?:[+\\-][0-9]+)?(?:\\/[A-G][b#]?)?';

// Regex for inline chords wrapped in brackets: [Am], (C#m7), [F#m7(b5)], etc.
const INLINE_CHORD_REGEX = new RegExp(
  `[\\[\\(]${CHORD_TOKEN}[\\]\\)]`,
  'g'
);

// Regex for lines consisting entirely of chords, separators (| - /), and whitespace
const CHORD_LINE_REGEX = new RegExp(
  `^[\\s\\-|/:]*(?:${CHORD_TOKEN}[\\s\\-|/:]*)+$`,
  'i'
);

// Regex for common section indicators in songs (Portuguese & English)
const SECTION_HEADER_REGEX =
  /^[\[(]?\s*(refrão|chorus|coro|verso\s*\d*|verse\s*\d*|estrofe\s*\d*|ponte|bridge|pré-refrão|pre-chorus|intro(?:\s*\(.*?\))?|solo|outro|final|tag|interlúdio|interlude)\s*[:\])]?/gi;

// Regex for repetition marks: (2x), [3x], 2X, (bis), (2 vezes)
const REPETITION_REGEX =
  /[\[(]?\s*(\b\d+\s*[xX]\b|\b[xX]\s*\d+\b|\bbis\b|\b\d+\s*vezes\b)\s*[\])]?/gi;

// Regex for metadata lines often found at the top of song lyric pages
const METADATA_LINE_REGEX =
  /^(composição|compositor|tom|bpm|artista|autor|ministério|álbum|letra):\s*.*/gi;

/**
 * Cleans and formats raw lyrics into standardized, slide-ready presentation text.
 * Optimized for projection tools (ProPresenter, Holyrics, OpenLP, PowerPoint).
 */
export function processLyrics(input: string, options: CleanOptions = {}): string {
  if (!input || !input.trim()) return '';

  const {
    linesPerBlock = 2,
    uppercaseTitle = true,
    removeChords = true,
    removeSections = true,
    removeRepetitions = true,
  } = options;

  let text = input;

  // 1. Remove emojis and decorative graphical characters
  text = text.replace(/[\p{Extended_Pictographic}]/gu, '');
  text = text.replace(/[▶►🔴━—=🎵🎶©®™•★☆✝✞✨♦]/g, '');
  text = text.replace(/[-_=+*~]{2,}/g, '');

  // 2. Remove inline chords if enabled
  if (removeChords) {
    text = text.replace(INLINE_CHORD_REGEX, '');
  }

  const rawLines = text.split(/\r?\n/);

  // 3. Process each line individually
  const cleanedLines: string[] = [];

  for (const line of rawLines) {
    let l = line.trim();

    // Preserve blank line separators for block grouping
    if (l === '') {
      cleanedLines.push('');
      continue;
    }

    // Skip lines that are purely musical chords
    if (removeChords && CHORD_LINE_REGEX.test(l)) {
      continue;
    }

    // Remove section headers
    if (removeSections) {
      l = l.replace(SECTION_HEADER_REGEX, '').trim();
    }

    // Remove repetition markers
    if (removeRepetitions) {
      l = l.replace(REPETITION_REGEX, '').trim();
    }

    // Remove metadata lines
    if (METADATA_LINE_REGEX.test(l)) {
      continue;
    }

    // Clean dangling brackets and quotes left from stripped tags
    l = l.replace(/^[()[\]{}]+|[()[\]{}]+$/g, '').trim();
    l = l.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    // Only add non-empty lines
    if (l.length > 0) {
      cleanedLines.push(l);
    }
  }

  // 4. Group lines into natural stanzas/blocks
  const rawBlocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of cleanedLines) {
    if (line === '') {
      if (currentBlock.length > 0) {
        rawBlocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) {
    rawBlocks.push(currentBlock);
  }

  if (rawBlocks.length === 0) return '';

  // 5. Intelligent Title & Lyric Extraction
  // Ensure lines of the first stanza are NEVER accidentally deleted!
  let title = '';
  const lyricsBlocks: string[][] = [];

  const firstBlock = rawBlocks[0];

  if (firstBlock.length === 1) {
    // Single isolated line before a blank line is definitely the title
    title = firstBlock[0];
    lyricsBlocks.push(...rawBlocks.slice(1));
  } else {
    // First block has multiple lines
    const firstLine = firstBlock[0];
    const secondLine = firstBlock[1];

    // Check if second line is likely an artist name (2-3 capitalized words)
    const isSecondLineArtist =
      /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+){1,2}$/.test(secondLine);

    if (isSecondLineArtist && firstBlock.length > 2) {
      // First line is Title, second is Artist, rest are actual lyric lines
      title = firstLine;
      const remainingInBlock = firstBlock.slice(2);
      if (remainingInBlock.length > 0) {
        lyricsBlocks.push(remainingInBlock);
      }
      lyricsBlocks.push(...rawBlocks.slice(1));
    } else {
      // Treat first line as title, and lines 2..N as part of the first stanza
      title = firstLine;
      const remainingLyrics = firstBlock.slice(1);
      lyricsBlocks.push(remainingLyrics);
      lyricsBlocks.push(...rawBlocks.slice(1));
    }
  }

  // 6. Partition all lyric stanzas into max `linesPerBlock` (default 2 lines per slide)
  const chunkSize = Math.max(1, linesPerBlock);
  const slideBlocks: string[][] = [];

  for (const block of lyricsBlocks) {
    if (!block || block.length === 0) continue;
    for (let i = 0; i < block.length; i += chunkSize) {
      slideBlocks.push(block.slice(i, i + chunkSize));
    }
  }

  // 7. Format Title
  const formattedTitle = uppercaseTitle ? title.toUpperCase() : title;

  // 8. Assemble final formatted string
  let output = '';
  if (formattedTitle) {
    output = formattedTitle + '\n\n';
  }

  output += slideBlocks.map((b) => b.join('\n')).join('\n\n');

  // Normalize excessive line breaks
  return output.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Calculates lyrics statistics (characters, lines, words, slides)
 */
export function calculateLyricStats(text: string): {
  chars: number;
  lines: number;
  words: number;
  slides: number;
} {
  if (!text || !text.trim()) {
    return { chars: 0, lines: 0, words: 0, slides: 0 };
  }

  const chars = text.length;
  const rawLines = text.split('\n');
  const nonEmptyLines = rawLines.filter((l) => l.trim().length > 0);
  const lines = nonEmptyLines.length;

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  // Count slides: number of blocks separated by 2 or more newlines
  const slides = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0).length;

  return { chars, lines, words, slides };
}
