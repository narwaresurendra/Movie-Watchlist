import { useState } from 'react';
import { getImageUrl } from '../services/tmdb';

export const MovieCard = ({ movie, onAddToWatchlist, onRemove, onMarkWatched, showActions = true }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative aspect-[2/3]">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <p className="text-sm text-slate-400 mb-2">{movie.release_year || movie.release_date?.split('-')[0]}</p>
        <p className="text-sm text-slate-300 line-clamp-3 mb-4">
          {movie.synopsis || movie.overview}
        </p>

        {showActions && (
          <div className="space-y-2">
            {onAddToWatchlist && (
              <button
                onClick={() => handleAction(onAddToWatchlist)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Watchlist'}
              </button>
            )}

            {onMarkWatched && (
              <button
                onClick={() => handleAction(onMarkWatched)}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Watched
              </button>
            )}

            {onRemove && (
              <button
                onClick={() => handleAction(onRemove)}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
