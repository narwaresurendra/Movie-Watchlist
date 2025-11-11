import { useState } from 'react';
import { getImageUrl } from '../services/tmdb';

export const MovieCard = ({ movie, onAddToWatchlist, onRemove, onMarkWatched, onWriteReview, showActions = true }) => {
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
      <div className="glass-effect rounded-3xl overflow-hidden h-full">
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } group-hover:scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3 font-medium">
            {movie.release_year || movie.release_date?.split('-')[0]}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
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
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  className="w-full btn-secondary py-2.5 text-sm border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Watched
                </button>
              )}

              {onWriteReview && (
                <button
                  onClick={() => handleAction(onWriteReview)}
                  disabled={loading}
                  className="w-full btn-secondary py-2.5 text-sm border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Write Review
                </button>
              )}

              {onRemove && (
                <button
                  onClick={() => handleAction(onRemove)}
                  disabled={loading}
                  className="w-full btn-secondary py-2.5 text-sm border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
