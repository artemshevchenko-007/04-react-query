import axios from "axios";
import type { Movie } from "../types/movie";

const TMDB_TOKEN = import.meta.env.VITE_API_KEY;

axios.defaults.baseURL = "https://api.themoviedb.org/3";
axios.defaults.headers.common["Authorization"] = `Bearer ${TMDB_TOKEN}`;

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesResponse> => {
  const response = await axios.get<MoviesResponse>("/search/movie", {
    params: {
      query,
      page,
    },
  });

  return response.data;
};
