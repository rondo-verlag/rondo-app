import { describe, it, expect } from 'vitest';
import ISong from '@/interfaces/ISong';

const songFilter = (song: ISong, query: string): boolean => {
  if (query === '') {
    return true;
  }
  const q = query.toLowerCase();
  const parsedPage = parseInt(query, 10);

  return (
    song.title.toLowerCase().includes(q) ||
    (!song.alternative && (song.interpret?.toLowerCase().includes(q) ?? false)) ||
    (!song.alternative && !isNaN(parsedPage) && (
      song.pageRondo2024 === parsedPage ||
      song.pageRondo2021 === parsedPage ||
      song.pageRondo2017 === parsedPage ||
      song.pageRondoRed === parsedPage ||
      song.pageRondoBlue === parsedPage ||
      song.pageRondoGreen === parsedPage
    ))
  );
};

describe('Song Filtering Logic', () => {
  const sampleSong: ISong = {
    id: 1,
    title: 'Campfire Nights',
    interpret: 'Scout Band',
    alternative: false,
    free: true,
    chords: ['C', 'G', 'Am', 'F'],
    license: 'CC-BY-SA',
    pageRondo2024: 42,
    pageRondo2021: 40,
    pageRondo2017: 38,
    pageRondoRed: 12,
    pageRondoBlue: 15,
    pageRondoGreen: 18,
  };

  const sampleAltSong: ISong = {
    id: 2,
    title: 'Lagerfeuer Nächte',
    interpret: 'Scout Band',
    alternative: true,
    free: true,
    chords: [],
    license: '',
    pageRondo2024: null,
    pageRondo2021: null,
    pageRondo2017: null,
    pageRondoRed: null,
    pageRondoBlue: null,
    pageRondoGreen: null,
  };

  it('matches all songs when query is empty', () => {
    expect(songFilter(sampleSong, '')).toBe(true);
    expect(songFilter(sampleAltSong, '')).toBe(true);
  });

  it('filters by title case-insensitively', () => {
    expect(songFilter(sampleSong, 'campfire')).toBe(true);
    expect(songFilter(sampleSong, 'NIGHTS')).toBe(true);
    expect(sampleSong.title).toContain('Campfire Nights');
    expect(songFilter(sampleSong, 'unknown song')).toBe(false);
  });

  it('filters by interpret for non-alternative songs', () => {
    expect(songFilter(sampleSong, 'scout band')).toBe(true);
    // Alternative songs should not match by interpret
    expect(songFilter(sampleAltSong, 'scout band')).toBe(false);
  });

  it('filters by page numbers across all editions', () => {
    expect(songFilter(sampleSong, '42')).toBe(true); // 2024
    expect(songFilter(sampleSong, '40')).toBe(true); // 2021
    expect(songFilter(sampleSong, '38')).toBe(true); // 2017
    expect(songFilter(sampleSong, '12')).toBe(true); // Red
    expect(songFilter(sampleSong, '15')).toBe(true); // Blue
    expect(songFilter(sampleSong, '18')).toBe(true); // Green
    expect(songFilter(sampleSong, '999')).toBe(false);
  });
});
