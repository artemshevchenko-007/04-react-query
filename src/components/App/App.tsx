import { useState } from "react";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { Toaster, toast } from "react-hot-toast";
import {
    fetchMovies
} from "../../services/movieService";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleSubmit = async (query: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
        const res = await fetchMovies(query);
        
         if (res.length === 0) {
      toast.error("No movies found for your request.");
    }
      setMovies(res);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={css.app}>
      {" "}
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
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

