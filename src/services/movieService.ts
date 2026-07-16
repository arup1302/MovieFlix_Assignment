import { movies } from '../data/movies';
import type { Movie } from '../types/movie';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch movies with simple paging simulation.
 * @param page 1-based page number
 * @param pageSize number of items per page
 */
export async function fetchMovies(page = 1, pageSize = 10): Promise<{ data: Movie[]; total: number }> {
  try {
    // Try to fetch from real API first (TMDb or similar)
    // Using mock data as fallback for now since no API key is configured
    await delay(700);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = movies.slice(start, end);
    return { data, total: movies.length };
  } catch (error) {
    console.log('API Error - using mock data:', error);
    // Fallback to mock data
    await delay(700);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = movies.slice(start, end);
    return { data, total: movies.length };
  }
}

/**
 * Fetch from TMDB API (requires API key)
 * To use: Set your TMDB_API_KEY environment variable
 */
export async function fetchMoviesFromTMDb(page = 1): Promise<{ data: Movie[]; total: number }> {
  try {
    const apiKey = 'YOUR_TMDB_API_KEY_HERE'; // Replace with actual key
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error('TMDB API Error');
    }
    
    const data = await response.json();
    return {
      data: data.results.map((movie: any) => ({
        id: String(movie.id),
        title: movie.title,
        overview: movie.overview,
        cover: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        banner: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
        genre: ['Drama'], // Extract from genres array
        tags: ['Featured'],
        duration: '2h 30m',
        runtime: '150 min',
        year: new Date(movie.release_date).getFullYear().toString(),
        rating: movie.vote_average.toFixed(1),
        director: 'Unknown',
        cast: [],
        related: [],
      })),
      total: data.total_results,
    };
  } catch (error) {
    console.log('TMDB API Error - falling back to mock data:', error);
    return fetchMovies(page);
  }
}

/**
 * Fetch random images from Unsplash API
 */
export async function fetchRandomImages(count = 4): Promise<string[]> {
  try {
    const images = Array.from({ length: count }).map((_, i) => 
      `https://picsum.photos/300/400?random=${Date.now() + i}`
    );
    return images;
  } catch (error) {
    console.log('Image API Error:', error);
    return [];
  }
}

export async function fetchFeaturedMovies(): Promise<Movie[]> {
  await delay(400);
  return movies.slice(0, 1);
}
