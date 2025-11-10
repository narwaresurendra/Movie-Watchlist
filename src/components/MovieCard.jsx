import { useState } from 'react';
import { getImageUrl } from '../services/tmdb';

export const MovieCard = ({ movie, onAddToWatchlist, onRemove, onMarkWatched, showActions = true }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group card-hover">
      <div className="glass-effect rounded-3xl overflow-hidden">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"></div>
          )}
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2 leading-snug">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            {movie.release_year || movie.release_date?.split('-')[0]}
          </p>
          <p className="text-sm text-gray-300 line-clamp-2 mb-5 leading-relaxed">
            {movie.synopsis || movie.overview}
          </p>

          {showActions && (
            <div className="space-y-2.5">
              {onAddToWatchlist && (
                <button
                  onClick={() => handleAction(onAddToWatchlist)}
                  disabled={loading}
                  className="w-full btn-primary py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add to Watchlist'
                  )}
                </button>
              )}

              {onMarkWatched && (
                <button
                  onClick={() => handleAction(onMarkWatched)}
                  disabled={loading}
                  className="w-full btn-secondary py-2.5 text-sm bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Watched
                </button>
              )}

              {onRemove && (
                <button
                  onClick={() => handleAction(onRemove)}
                  disabled={loading}
                  className="w-full btn-secondary py-2.5 text-sm bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Removing...' : 'Remove'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
