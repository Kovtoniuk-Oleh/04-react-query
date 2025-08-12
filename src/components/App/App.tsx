import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies } from '../../services/movieService';
import { Movie } from '../../types/movie';
import { Toaster, toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';
import 'modern-normalize/modern-normalize.css';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadMovies = async (searchQuery: string, pageNumber: number) => {
    setLoading(true);
    setError(false);
    setSelectedMovie(null);

    try {
      const data = await fetchMovies(searchQuery, pageNumber, 'uk-UA'); // локалізація
      if (data.results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch {
      setError(true);
      toast.error('Щось пішло не так. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
    loadMovies(searchQuery, 1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setPage(newPage);
    loadMovies(query, newPage);
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
        {totalPages > 1 && !loading && !error && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      </main>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
