import { MovieCard } from './MovieCard';

export const SearchResults = ({ movies, onAddToWatchlist, loading, onClose }) => {
  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-4 glass-effect rounded-2xl shadow-2xl p-8 z-50 max-h-[600px] overflow-y-auto">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-4 glass-effect rounded-2xl shadow-2xl p-6 z-50 max-h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAddToWatchlist={() => onAddToWatchlist(movie)}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};
