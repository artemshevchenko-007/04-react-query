import { useState } from "react";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { Toaster, toast } from "react-hot-toast";

import { fetchMovies } from "../../services/movieService";

import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadMovies = async (searchQuery: string, page: number) => {
    try {
      setIsLoading(true);
      setIsError(false);

      const res = await fetchMovies(searchQuery, page);

      if (res.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
        setTotalPages(0);
        return;
      }

      setMovies(res.results);
      setTotalPages(res.total_pages);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);

    await loadMovies(searchQuery, 1);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    await loadMovies(query, page);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />

      <Toaster />

      {isError && <ErrorMessage />}

      {isLoading && <Loader />}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={handleSelect} />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}