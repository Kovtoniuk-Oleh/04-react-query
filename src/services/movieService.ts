import axios, { AxiosResponse } from 'axios';
import { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const SEARCH_ENDPOINT = '/search/movie';

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number,
  language: string = 'uk-UA' // або 'en-US', залежно від потреб
): Promise<FetchMoviesResponse> => {
  try {
    const response: AxiosResponse<FetchMoviesResponse> = await axios.get(`${BASE_URL}${SEARCH_ENDPOINT}`, {
      params: {
        query,
        page,
        language,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    throw error;
  }
};
