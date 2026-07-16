import type { Movie } from '../types/movie';

// 20 mock movies for development and paging tests
export const movies: Movie[] = Array.from({ length: 20 }).map((_, i) => {
  const id = String(i + 1);
  const titles = [
    'Galactic Run',
    'Eternal Shores',
    'Neon City',
    'Midnight Heist',
    'Silent Valley',
    'Crimson Dawn',
    'Last Harbor',
    'Echoes of Tomorrow',
    'Paper Planes',
    'Summer Bloom',
    'Steel Rain',
    'Hidden Fortress',
    'Glass Sky',
    'Waves of Time',
    'The Long Road',
    'Lost Signals',
    'Broken Compass',
    'Shadow Alley',
    'City of Lights',
    'Final Broadcast',
  ];

  const genresPool = [
    ['Action', 'Sci-fi'],
    ['Drama', 'Romance'],
    ['Thriller', 'Crime'],
    ['Action', 'Thriller'],
    ['Drama'],
    ['Action', 'Adventure'],
    ['Drama', 'Mystery'],
    ['Sci-fi'],
    ['Comedy'],
    ['Romance'],
  ];

  const imgBase = 'https://images.unsplash.com/photo-';
  const images = [
    '1524985069026-dd778a71c7b4',
    '1500534623283-312aade485b7',
    '1494526585095-c41746248156',
    '1558981403-c4a8dbee8a2e',
    '1529637182904-4c17ac7cd5fd',
    '1517602302552-471fe67acf66',
    '1507525428034-b723cf961d3e',
    '1517694712202-14dd9538aa97',
    '1518709268805-4e9042af9f23',
    '1506794778202-cad84cf45f1d',
    '1506084868235-39b6e9a1d4d6',
    '1519985176271-adb1088fa94c',
    '1526318472351-bc8b3b2a6a79',
    '1526316507421-2f3b6a7abf0a',
    '1508921342601-3a3f4c9892a0',
    '1517816741759-7f2f3b3d7b2b',
    '1509042232457-c39d85a0e0b2',
    '1519125323391-6eea6a70f5b0',
    '1500530855692-91fb2f4b3d9a',
    '1519125323391-6eea6a70f5b0',
  ];

  const cover = `${imgBase}${images[i % images.length]}?fit=crop&w=800&q=80`;
  const banner = `${imgBase}${images[(i + 3) % images.length]}?fit=crop&w=1200&q=80`;

  const genre = genresPool[i % genresPool.length];

  const directors = [
    'A. Smith',
    'L. Johnson',
    'R. Carter',
    'M. Nguyen',
    'S. Patel',
    'T. Rivera',
    'C. Brooks',
    'N. Williams',
    'E. Kim',
    'J. Garcia',
  ];

  const casts = [
    ['Mia Fox', 'Leo Blake', 'Noah Reed'],
    ['Ava Stone', 'Liam Hart', 'Zoe Chen'],
    ['Eli Cole', 'Nora Mills', 'Owen Park'],
    ['Ivy Lane', 'Mason Pike', 'Ruby Rose'],
    ['Luca King', 'Emma Page', 'Aria Day'],
    ['Finn Ward', 'Maya Lake', 'Jude Starr'],
    ['Sara Beau', 'Jonah West', 'Lila Moon'],
    ['Alex Cruz', 'Nina Vale', 'Cal Watts'],
    ['Riley Owen', 'Sadie Fox', 'Noel Lane'],
    ['Parker Ray', 'Luna Snow', 'Theo Chase'],
  ];

  return {
    id,
    title: titles[i % titles.length],
    overview: `${titles[i % titles.length]} is an engaging story focused on strong characters and a memorable journey.`,
    cover,
    banner,
    genre,
    tags: ['Featured', genre[0]],
    duration: `${1 + (i % 3)}h ${20 + (i % 40)}m`,
    runtime: `${100 + i * 4} min`,
    year: String(2020 + (i % 6)),
    rating: (4 + ((i % 5) * 0.2)).toFixed(1),
    director: directors[i % directors.length],
    cast: casts[i % casts.length],
    related: [],
  } as Movie;
});

// Populate related covers for each movie
movies.forEach((m, idx) => {
  const next = (idx + 1) % movies.length;
  const next2 = (idx + 2) % movies.length;
  m.related = [
    { id: movies[next].id, cover: movies[next].cover },
    { id: movies[next2].id, cover: movies[next2].cover },
  ];
});
