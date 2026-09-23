export type Language = 'en' | 'pt';

export interface Translations {
  appName: string;
  appTagline: string;
  appCategory: string;
  autoFormat: string;
  options: string;
  formatNow: string;
  linesPerSlide: string;
  uppercaseTitle: string;
  removeChords: string;
  removeSections: string;
  tabInput: string;
  tabOutput: string;
  originalLyrics: string;
  sampleButton: string;
  pasteButton: string;
  clearButton: string;
  inputPlaceholder: string;
  inputFooterHint: string;
  linesCount: (count: number) => string;
  charsCount: (count: number) => string;
  wordsCount: (count: number) => string;
  slidesCount: (count: number) => string;
  outputTitle: string;
  editableHint: string;
  previewSlides: string;
  copyButton: string;
  copiedButton: string;
  outputPlaceholder: string;
  waitingLyrics: string;
  historyTitle: string;
  historySubtitle: (count: number) => string;
  historyClearAll: string;
  historyEmptyTitle: string;
  historyEmptyDesc: string;
  historyDeleteTooltip: string;
  toastPasted: string;
  toastSampleLoaded: string;
  toastFormatted: string;
  toastCopied: string;
  toastCopyError: string;
  toastClipboardError: string;
  slidePreviewTitle: string;
  slideOf: (current: number, total: number) => string;
  nextSlide: string;
  prevSlide: string;
  closePreview: string;
  previewKeyboardHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'LyricFlow',
    appTagline: 'Slide & Worship Lyric Formatter',
    appCategory: 'Presentation Studio',
    autoFormat: 'Auto-Format',
    options: 'Rules',
    formatNow: 'Format Now',
    linesPerSlide: 'Lines per slide:',
    uppercaseTitle: 'UPPERCASE Title',
    removeChords: 'Strip Chords',
    removeSections: 'Remove Section Tags',
    tabInput: 'Input',
    tabOutput: 'Slides Output',
    originalLyrics: 'Source Lyrics',
    sampleButton: 'Load Sample',
    pasteButton: 'Paste',
    clearButton: 'Clear',
    inputPlaceholder:
      'Paste raw lyrics here with chords, tabs, emojis or section tags...\n\nClick "Load Sample" above to test immediately!',
    inputFooterHint: 'Raw chords & annotations stripped automatically',
    linesCount: (c) => `${c} ${c === 1 ? 'line' : 'lines'}`,
    charsCount: (c) => `${c} characters`,
    wordsCount: (c) => `${c} ${c === 1 ? 'word' : 'words'}`,
    slidesCount: (c) => `${c} ${c === 1 ? 'slide' : 'slides'}`,
    outputTitle: 'Slide-Ready Output',
    editableHint: 'Click to edit formatted output directly',
    previewSlides: 'Preview Slides',
    copyButton: 'Copy Output',
    copiedButton: 'Copied!',
    outputPlaceholder:
      'Cleaned, 2-line slide partitions will appear here ready for ProPresenter, Holyrics, or PowerPoint...',
    waitingLyrics: 'Awaiting source lyrics',
    historyTitle: 'Recent Lyrics',
    historySubtitle: (c) =>
      `${c} ${c === 1 ? 'song saved' : 'songs saved'} on this device`,
    historyClearAll: 'Clear all',
    historyEmptyTitle: 'No saved lyrics yet',
    historyEmptyDesc:
      'When you copy a formatted song, it will automatically be saved here for quick recall.',
    historyDeleteTooltip: 'Delete from history',
    toastPasted: 'Lyrics pasted from clipboard!',
    toastSampleLoaded: 'Sample song loaded!',
    toastFormatted: 'Lyrics formatted successfully!',
    toastCopied: 'Copied to clipboard!',
    toastCopyError: 'Failed to copy to clipboard.',
    toastClipboardError:
      'Clipboard access denied. Please use Ctrl+V / paste manually.',
    slidePreviewTitle: '16:9 Presentation Preview',
    slideOf: (curr, total) => `Slide ${curr} of ${total}`,
    nextSlide: 'Next Slide',
    prevSlide: 'Previous Slide',
    closePreview: 'Close Preview',
    previewKeyboardHint: 'Use Left / Right arrow keys or click to navigate',
  },
  pt: {
    appName: 'LyricFlow',
    appTagline: 'Formatador de Letras para Projeção & Louvor',
    appCategory: 'Projeção & Slides',
    autoFormat: 'Formatação Automática',
    options: 'Regras',
    formatNow: 'Formatar Agora',
    linesPerSlide: 'Linhas por slide:',
    uppercaseTitle: 'Título em CAIXA ALTA',
    removeChords: 'Remover Cifras',
    removeSections: 'Remover Tags de Seção',
    tabInput: 'Entrada',
    tabOutput: 'Resultado dos Slides',
    originalLyrics: 'Letras Originais',
    sampleButton: 'Exemplo',
    pasteButton: 'Colar',
    clearButton: 'Limpar',
    inputPlaceholder:
      'Cole letras aqui com cifras, marcações, emojis ou anotações...\n\nClique no botão "Exemplo" acima para testar agora mesmo!',
    inputFooterHint: 'Cifras, acordes e seções limpos automaticamente',
    linesCount: (c) => `${c} ${c === 1 ? 'linha' : 'linhas'}`,
    charsCount: (c) => `${c} caracteres`,
    wordsCount: (c) => `${c} ${c === 1 ? 'palavra' : 'palavras'}`,
    slidesCount: (c) => `${c} ${c === 1 ? 'slide' : 'slides'}`,
    outputTitle: 'Pronto para Projeção',
    editableHint: 'Clique para editar o resultado diretamente',
    previewSlides: 'Visualizar Slides',
    copyButton: 'Copiar Letra',
    copiedButton: 'Copiado!',
    outputPlaceholder:
      'As estrofes formatadas em blocos de 2 linhas aparecerão aqui para ProPresenter, Holyrics ou PowerPoint...',
    waitingLyrics: 'Aguardando letra original',
    historyTitle: 'Letras Recentes',
    historySubtitle: (c) =>
      `${c} ${c === 1 ? 'música salva' : 'músicas salvas'} no dispositivo`,
    historyClearAll: 'Limpar tudo',
    historyEmptyTitle: 'Nenhuma letra salva ainda',
    historyEmptyDesc:
      'Ao copiar o resultado formatado, a música será salva automaticamente aqui no seu aparelho.',
    historyDeleteTooltip: 'Remover do histórico',
    toastPasted: 'Texto colado da área de transferência!',
    toastSampleLoaded: 'Música de exemplo carregada!',
    toastFormatted: 'Letra formatada com sucesso!',
    toastCopied: 'Copiado para a área de transferência!',
    toastCopyError: 'Erro ao copiar.',
    toastClipboardError:
      'Permissão negada. Use Ctrl+V para colar na caixa de texto.',
    slidePreviewTitle: 'Prévia de Projeção 16:9',
    slideOf: (curr, total) => `Slide ${curr} de ${total}`,
    nextSlide: 'Próximo Slide',
    prevSlide: 'Slide Anterior',
    closePreview: 'Fechar Prévia',
    previewKeyboardHint: 'Use as setas ← e → do teclado para navegar',
  },
};

export const SAMPLE_LYRICS_EN = `🎵 RECKLESS LOVE 🎵
Words & Music: Cory Asbury / Caleb Culver / Ran Jackson
Key: G | BPM: 68
━━━━━━━━━━━━━━━━━━━━━━━━

[Intro]
Em7  D  C9  G

[Verse 1]
Em7          D           C9
Before I spoke a word, You were singing over me
Em7          D              C9
You have been so, so good to me (2x)
Em7          D           C9
Before I took a breath, You breathed Your life in me
Em7          D              C9
You have been so, so kind to me

[Chorus]
G                       D/F#
Oh, the overwhelming, never-ending, reckless love of God
Em7                     C9
Oh, it chases me down, fights 'til I'm found, leaves the ninety-nine
G                        D/F#
I couldn't earn it, and I don't deserve it, still, You give Yourself away
Em7                     C9
Oh, the overwhelming, never-ending, reckless love of God (bis)

[Bridge]
Em7               D
There's no shadow You won't light up
C9                G
Mountain You won't climb up, coming after me
Em7               D
There's no wall You won't kick down
C9                G
Lie You won't tear down, coming after me [3x]
`;

export const SAMPLE_LYRICS_PT = `🎵 OUSADO AMOR 🎵
Composição: Cory Asbury / Versão: Isaías Saad
Tom: G | BPM: 68
━━━━━━━━━━━━━━━━━━━━━━━━

[Intro]
Em7  D  C9  G

[Verso 1]
Em7          D           C9
Antes de eu falar, Tu cantavas sobre mim
Em7          D              C9
Tu tens sido tão, tão bom pra mim (2x)
Em7          D           C9
Antes de eu respirar, sopraste Tua vida em mim
Em7          D              C9
Tu tens sido tão, tão bom pra mim

[Refrão]
G                       D/F#
Oh, impressionante, infinito e ousado amor de Deus
Em7                     C9
Oh, que deixa as noventa e nove só pra me encontrar
G                        D/F#
Não posso comprá-lo, nem merecê-lo, mesmo assim se entregou
Em7                     C9
Oh, impressionante, infinito e ousado amor de Deus (bis)

[Ponte]
Em7               D
Traz luz para as sombras
C9                G
Escala montanhas pra me encontrar
Em7               D
Derruba muralhas, destrói as mentiras
C9                G
Pra me encontrar [3x]
`;
