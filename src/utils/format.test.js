import { releaseYear, formatRating, formatRuntime, formatMoney, pickTrailer } from './format';

describe('format helpers', () => {
  test('releaseYear extracts the year or returns a dash', () => {
    expect(releaseYear('2024-05-17')).toBe('2024');
    expect(releaseYear('')).toBe('—');
    expect(releaseYear(undefined)).toBe('—');
  });

  test('formatRating rounds to one decimal and handles missing values', () => {
    expect(formatRating(7.456)).toBe('7.5');
    expect(formatRating(0)).toBe('NR');
    expect(formatRating(null)).toBe('NR');
  });

  test('formatRuntime converts minutes', () => {
    expect(formatRuntime(142)).toBe('2h 22m');
    expect(formatRuntime(45)).toBe('45m');
    expect(formatRuntime(0)).toBeNull();
  });

  test('formatMoney formats USD', () => {
    expect(formatMoney(150000000)).toBe('$150,000,000');
    expect(formatMoney(0)).toBeNull();
  });

  test('pickTrailer prefers official YouTube trailers', () => {
    const videos = {
      results: [
        { key: 'teaser', site: 'YouTube', type: 'Teaser' },
        { key: 'vimeo', site: 'Vimeo', type: 'Trailer', official: true },
        { key: 'unofficial', site: 'YouTube', type: 'Trailer', official: false },
        { key: 'official', site: 'YouTube', type: 'Trailer', official: true },
      ],
    };
    expect(pickTrailer(videos).key).toBe('official');
    expect(pickTrailer({ results: [] })).toBeNull();
    expect(pickTrailer(undefined)).toBeNull();
  });
});
