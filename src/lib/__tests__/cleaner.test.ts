import { describe, it, expect } from 'vitest';
import { processLyrics, calculateLyricStats } from '../cleaner';
import { SAMPLE_LYRICS_EN, SAMPLE_LYRICS_PT } from '../i18n';

describe('processLyrics', () => {
  it('returns empty string on empty input', () => {
    expect(processLyrics('')).toBe('');
    expect(processLyrics('   ')).toBe('');
  });

  it('removes emojis and decorative symbols', () => {
    const input = '🎵 Porque Ele Vive 🎶\n🔴 Deus é bom\n━━━━━━━━━━━━━━\nE me amou primeiro';
    const output = processLyrics(input);
    expect(output).not.toContain('🎵');
    expect(output).not.toContain('🎶');
    expect(output).not.toContain('🔴');
    expect(output).not.toContain('━');
  });

  it('removes section headers like [Refrão], (Ponte), [Verse 1], (Chorus)', () => {
    const input = `Grace
[Verse 1]
Your grace is enough
[Chorus]
Hallelujah, hallelujah
(Bridge)
Holy are You Lord`;
    const output = processLyrics(input);
    expect(output).not.toContain('[Verse 1]');
    expect(output).not.toContain('[Chorus]');
    expect(output).not.toContain('(Bridge)');
    expect(output).toContain('Your grace is enough');
    expect(output).toContain('Hallelujah, hallelujah');
  });

  it('removes repetition markers like (2x), [3x], (bis)', () => {
    const input = `Praise the Lord
Holy is His name (2x)
Worthy of praise [3x]
Forever and ever (bis)`;
    const output = processLyrics(input);
    expect(output).not.toContain('(2x)');
    expect(output).not.toContain('[3x]');
    expect(output).not.toContain('(bis)');
    expect(output).toContain('Holy is His name');
  });

  it('removes inline chords and chord-only lines', () => {
    const input = `He Loves Us
G    D/F#    Em    C
He loves us like [G]a hurricane
[D/F#]I am a tree bending beneath the weight of His [Em]wind
C    G/B    Am7    D
Yeah, He [C]loves us`;
    const output = processLyrics(input);
    expect(output).not.toContain('[G]');
    expect(output).not.toContain('[D/F#]');
    expect(output).not.toContain('[Em]');
    expect(output).not.toContain('G    D/F#');
    expect(output).not.toContain('C    G/B    Am7');
    expect(output).toContain('He loves us like a hurricane');
  });

  it('formats title in uppercase by default', () => {
    const input = 'goodness of god\nI love You Lord, for Your mercy never fails me';
    const output = processLyrics(input);
    expect(output.startsWith('GOODNESS OF GOD\n\n')).toBe(true);
  });

  it('splits long stanzas into maximum 2 lines per slide', () => {
    const input = `Reckless Love
Before I spoke a word
You were singing over me
You have been so, so good to me
Before I took a breath
You breathed Your life in me`;
    const output = processLyrics(input);
    const blocks = output.split('\n\n');
    expect(blocks[0]).toBe('RECKLESS LOVE');
    for (let i = 1; i < blocks.length; i++) {
      const lineCount = blocks[i].split('\n').length;
      expect(lineCount).toBeLessThanOrEqual(2);
    }
  });

  it('processes full English sample song cleanly', () => {
    const output = processLyrics(SAMPLE_LYRICS_EN);
    expect(output).toContain('RECKLESS LOVE');
    expect(output).not.toContain('Em7  D  C9  G');
    expect(output).not.toContain('[Verse 1]');
    expect(output).not.toContain('[Chorus]');
    expect(output).not.toContain('(2x)');
    expect(output).not.toContain('[3x]');
  });

  it('processes full Portuguese sample song cleanly', () => {
    const output = processLyrics(SAMPLE_LYRICS_PT);
    expect(output).toContain('OUSADO AMOR');
    expect(output).not.toContain('Em7  D  C9  G');
    expect(output).not.toContain('[Verso 1]');
    expect(output).not.toContain('[Refrão]');
    expect(output).not.toContain('(bis)');
  });

  it('never deletes lines from the first stanza when pasting continuous lyrics', () => {
    const input = `Primeiro Amor
Quero voltar ao início de tudo
Encontrar-me contigo, Senhor
Quero rever meus conceitos e pontos de vista
O primeiro amor eu quero ter`;
    const output = processLyrics(input);
    expect(output).toContain('PRIMEIRO AMOR');
    expect(output).toContain('Quero voltar ao início de tudo');
    expect(output).toContain('Encontrar-me contigo, Senhor');
    expect(output).toContain('Quero rever meus conceitos e pontos de vista');
    expect(output).toContain('O primeiro amor eu quero ter');
  });

  it('calculates lyric statistics accurately', () => {
    const text = 'TITLE\n\nLine one\nLine two\n\nLine three\nLine four';
    const stats = calculateLyricStats(text);
    expect(stats.lines).toBe(5);
    expect(stats.slides).toBe(3);
    expect(stats.words).toBe(9);
  });
});
