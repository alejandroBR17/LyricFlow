export interface HistoryItem {
  id: string;
  title: string;
  original: string;
  cleaned: string;
  date: string;
  slideCount?: number;
}

export interface CleanOptions {
  linesPerBlock?: number;
  uppercaseTitle?: boolean;
  removeChords?: boolean;
  removeSections?: boolean;
  removeRepetitions?: boolean;
}

export interface LyricStats {
  chars: number;
  lines: number;
  words: number;
  slides: number;
}
