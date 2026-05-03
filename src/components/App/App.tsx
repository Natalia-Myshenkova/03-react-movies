import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);

      const results = await fetchMovies(query);

      setMovies(results);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "white",
            color: "black",
          },
        }}
      />

      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}