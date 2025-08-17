import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (query: string, page: number): Promise<MoviesResponse> => {
  try {
    const response = await axios.get<MoviesResponse>(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        query,
        page,
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    throw error;
  }
};
