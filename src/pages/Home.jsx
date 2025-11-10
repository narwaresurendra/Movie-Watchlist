import { useState, useEffect } from 'react';
import { searchMovies, formatMovieData } from '../services/tmdb';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { MovieCard } from '../components/MovieCard';
import { Recommendations } from '../components/Recommendations';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    } else {
      setMovies([]);
    }
  }, [debouncedSearch]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchMovies(debouncedSearch);
      setMovies(results);
    } catch (error) {
      console.error('Error searching movies:', error);
      showMessage('Error searching movies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    try {
      const { data: existing } = await supabase
        .from('watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movie.id)
        .maybeSingle();

      if (existing) {
        showMessage('Movie already in watchlist', 'info');
        return;
      }

      const movieData = formatMovieData(movie);
      const { error } = await supabase
        .from('watchlist')
        .insert([{ ...movieData, user_id: user.id }]);

      if (error) throw error;
      showMessage('Added to watchlist!', 'success');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      showMessage('Error adding to watchlist', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Recommendations />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Movies</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                : message.type === 'error'
                ? 'bg-red-500/10 border border-red-500/50 text-red-400'
                : 'bg-blue-500/10 border border-blue-500/50 text-blue-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && searchQuery && movies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No movies found</p>
          </div>
        )}

        {!loading && !searchQuery && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">Search for movies to add to your watchlist</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onAddToWatchlist={() => addToWatchlist(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
