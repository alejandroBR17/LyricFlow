import { describe, it, expect } from 'vitest';
import { processLyrics, calculateLyricStats } from '../cleaner';
import { SAMPLE_LYRICS } from '../sampleLyrics';

describe('processLyrics', () => {
  it('retorna string vazia para entrada vazia ou só com espaços', () => {
    expect(processLyrics('')).toBe('');
    expect(processLyrics('   ')).toBe('');
  });

  it('remove emojis e caracteres decorativos', () => {
    const input = '🎵 Porque Ele Vive 🎶\n🔴 Deus é bom\n━━━━━━━━━━━━━━\nE me amou primeiro';
    const output = processLyrics(input);
    expect(output).not.toContain('🎵');
    expect(output).not.toContain('🎶');
    expect(output).not.toContain('🔴');
    expect(output).not.toContain('━');
  });

  it('remove cabeçalhos de seção como [Refrão], (Ponte), [Verso 1], (Chorus)', () => {
    const input = `Graça
[Verso 1]
Tua graça me basta
[Refrão]
Aleluia, aleluia
(Ponte)
Santo és Tu`;
    const output = processLyrics(input);
    expect(output).not.toContain('[Verso 1]');
    expect(output).not.toContain('[Refrão]');
    expect(output).not.toContain('(Ponte)');
    expect(output).toContain('Tua graça me basta');
    expect(output).toContain('Aleluia, aleluia');
  });

  it('remove marcadores de repetição como (2x), [3x], (bis)', () => {
    const input = `Louvai ao Senhor
Santo é o Seu nome (2x)
Digno de louvor [3x]
Para sempre amém (bis)`;
    const output = processLyrics(input);
    expect(output).not.toContain('(2x)');
    expect(output).not.toContain('[3x]');
    expect(output).not.toContain('(bis)');
    expect(output).toContain('Santo é o Seu nome');
  });

  it('remove acordes entre colchetes e linhas exclusivas de cifras', () => {
    const input = `Me Ama
G    D/F#    Em    C
Como [G]Ele nos ama
[D/F#]O Seu amor é como um [Em]furacão
C    G/B    Am7    D
E eu me rendo ao Teu [C]amor`;
    const output = processLyrics(input);
    expect(output).not.toContain('[G]');
    expect(output).not.toContain('[D/F#]');
    expect(output).not.toContain('[Em]');
    expect(output).not.toContain('G    D/F#');
    expect(output).not.toContain('C    G/B    Am7');
    expect(output).toContain('Como Ele nos ama');
    expect(output).toContain('O Seu amor é como um furacão');
  });

  it('formata o título em caixa alta por padrão', () => {
    const input = 'bondade de deus\nTe amo Deus, Tua graça nunca falha';
    const output = processLyrics(input);
    expect(output.startsWith('BONDADE DE DEUS\n\n')).toBe(true);
  });

  it('divide estrofes longas em no máximo 2 linhas por slide', () => {
    const input = `Ousado Amor
Antes de eu falar
Tu cantavas sobre mim
Tu tens sido tão, tão bom pra mim
Antes de eu respirar
Sopraste Tua vida em mim`;
    const output = processLyrics(input);
    const blocks = output.split('\n\n');
    expect(blocks[0]).toBe('OUSADO AMOR');
    for (let i = 1; i < blocks.length; i++) {
      const lineCount = blocks[i].split('\n').length;
      expect(lineCount).toBeLessThanOrEqual(2);
    }
  });

  it('processa a música de exemplo brasileira com precisão completa', () => {
    const output = processLyrics(SAMPLE_LYRICS);
    expect(output).toContain('OUSADO AMOR');
    expect(output).not.toContain('Em7  D  C9  G');
    expect(output).not.toContain('[Verso 1]');
    expect(output).not.toContain('[Refrão]');
    expect(output).not.toContain('(bis)');
    expect(output).not.toContain('(2x)');
    expect(output).not.toContain('[3x]');
  });

  it('preserva todas as estrofes sem descartar versos contínuos', () => {
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

  it('calcula estatísticas de letra com precisão', () => {
    const text = 'TITULO\n\nLinha um\nLinha dois\n\nLinha tres\nLinha quatro';
    const stats = calculateLyricStats(text);
    expect(stats.lines).toBe(5);
    expect(stats.slides).toBe(3);
    expect(stats.words).toBe(9);
  });
});
