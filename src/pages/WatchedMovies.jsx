import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/tmdb';
import { StarRating } from '../components/StarRating';
import { RatingModal } from '../components/RatingModal';
import { ReviewModal } from '../components/ReviewModal';

export const WatchedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [reviewMovie, setReviewMovie] = useState(null);
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchedMovies();
  }, [user]);

  const filteredAndSortedMovies = () => {
    let filtered = movies.filter(m => m.rating >= filterRating);

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.watched_date) - new Date(a.watched_date);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const averageRating = movies.length > 0
    ? (movies.reduce((sum, m) => sum + parseFloat(m.rating), 0) / movies.length).toFixed(1)
    : 0;

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

  const displayedMovies = filteredAndSortedMovies();

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Watched Movies</h1>
          {movies.length > 0 && (
            <div className="text-right">
              <p className="text-slate-400 text-sm">Total watched</p>
              <p className="text-white text-2xl font-bold">{movies.length}</p>
              <p className="text-slate-400 text-sm">Average rating: {averageRating}</p>
            </div>
          )}
        </div>

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
          <>
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-slate-400 text-sm">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="date">Date Watched</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-slate-400 text-sm">Filter:</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(parseFloat(e.target.value))}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedMovies.map((movie) => (
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
                      onClick={() => setReviewMovie(movie)}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                    >
                      Write Review
                    </button>
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
          </>
        )}
      </div>

      {editingMovie && (
        <RatingModal
          movie={editingMovie}
          onSubmit={updateRating}
          onClose={() => setEditingMovie(null)}
        />
      )}

      {reviewMovie && (
        <ReviewModal
          movie={reviewMovie}
          onClose={() => setReviewMovie(null)}
          onSubmit={() => {
            showMessage('Review submitted successfully!', 'success');
            setReviewMovie(null);
          }}
        />
      )}
    </div>
  );
};
