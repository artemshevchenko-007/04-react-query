import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";

import css from "./App.module.css";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["movies", query, currentPage],

    queryFn: () => fetchMovies(query, currentPage),

    enabled: query !== "",

    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />

      <Toaster />

      {(isLoading || isFetching) && <Loader />}

      {isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <>
          <MovieGrid
            movies={data.results}
            onSelect={setSelectedMovie}
          />

          <Pagination
            pageCount={data.total_pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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