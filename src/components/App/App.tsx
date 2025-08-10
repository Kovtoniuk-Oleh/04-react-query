import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import { Toaster, toast } from 'react-hot-toast';
import 'modern-normalize/modern-normalize.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setSelectedMovie(null);
    setError(false);
    setLoading(true);

    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && <MovieGrid movies={movies} onSelect={setSelectedMovie} />}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      </main>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
