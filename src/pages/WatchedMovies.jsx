import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/tmdb';
import { StarRating } from '../components/StarRating';
import { RatingModal } from '../components/RatingModal';

export const WatchedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchedMovies();
  }, [user]);

  const fetchWatchedMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('watched_movies')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_date', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching watched movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRating = async (newRating) => {
    try {
      const { error } = await supabase
        .from('watched_movies')
        .update({ rating: newRating })
        .eq('id', editingMovie.id);

      if (error) throw error;

      setMovies(movies.map((m) =>
        m.id === editingMovie.id ? { ...m, rating: newRating } : m
      ));
      showMessage('Rating updated!', 'success');
    } catch (error) {
      console.error('Error updating rating:', error);
      showMessage('Error updating rating', 'error');
    }
  };

  const deleteMovie = async (movieId) => {
    if (!confirm('Are you sure you want to remove this movie?')) return;

    try {
      const { error } = await supabase
        .from('watched_movies')
        .delete()
        .eq('id', movieId);

      if (error) throw error;
      setMovies(movies.filter((m) => m.id !== movieId));
      showMessage('Movie removed', 'success');
    } catch (error) {
      console.error('Error deleting movie:', error);
      showMessage('Error removing movie', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Watched Movies</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {movies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-slate-400 text-lg mb-2">No watched movies yet</p>
            <p className="text-slate-500">Mark movies as watched to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-full px-3 py-1">
                    <span className="text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">{movie.release_year}</p>
                  <p className="text-xs text-slate-500 mb-3">Watched on {formatDate(movie.watched_date)}</p>

                  <div className="mb-4 flex justify-center">
                    <StarRating rating={parseFloat(movie.rating)} readOnly />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setEditingMovie(movie)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                    >
                      Edit Rating
                    </button>
                    <button
                      onClick={() => deleteMovie(movie.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingMovie && (
        <RatingModal
          movie={editingMovie}
          onSubmit={updateRating}
          onClose={() => setEditingMovie(null)}
        />
      )}
    </div>
  );
};
