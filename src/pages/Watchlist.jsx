import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { RatingModal } from '../components/RatingModal';
import { ReviewModal } from '../components/ReviewModal';

export const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviewMovie, setReviewMovie] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_date', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', movieId);

      if (error) throw error;
      setMovies(movies.filter((m) => m.id !== movieId));
      showMessage('Removed from watchlist', 'success');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      showMessage('Error removing from watchlist', 'error');
    }
  };

  const markAsWatched = (movie) => {
    setSelectedMovie(movie);
  };

  const submitRating = async (rating) => {
    try {
      const { error: insertError } = await supabase
        .from('watched_movies')
        .insert([{
          user_id: user.id,
          movie_id: selectedMovie.movie_id,
          title: selectedMovie.title,
          poster_path: selectedMovie.poster_path,
          release_year: selectedMovie.release_year,
          genres: selectedMovie.genres,
          synopsis: selectedMovie.synopsis,
          rating: rating,
        }]);

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', selectedMovie.id);

      if (deleteError) throw deleteError;

      setMovies(movies.filter((m) => m.id !== selectedMovie.id));
      showMessage('Movie marked as watched!', 'success');
    } catch (error) {
      console.error('Error marking as watched:', error);
      showMessage('Error marking as watched', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
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
        <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>

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
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-400 text-lg mb-2">Your watchlist is empty</p>
            <p className="text-slate-500">Search for movies and add them to your watchlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRemove={() => removeFromWatchlist(movie.id)}
                onMarkWatched={() => markAsWatched(movie)}
                onWriteReview={() => setReviewMovie(movie)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <RatingModal
          movie={selectedMovie}
          onSubmit={submitRating}
          onClose={() => setSelectedMovie(null)}
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
