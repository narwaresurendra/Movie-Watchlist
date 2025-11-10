import { useState, useEffect } from 'react';
import { MovieCard } from '../components/MovieCard';
import { SearchResults } from '../components/SearchResults';
import { Recommendations } from '../components/Recommendations';
import { searchMovies, getTrendingMovies, formatMovieData } from '../services/tmdb';
import { useDebounce } from '../hooks/useDebounce';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [message, setMessage] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { user } = useAuth();

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      performSearch(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const fetchTrendingMovies = async () => {
    const movies = await getTrendingMovies();
    setTrendingMovies(movies);
  };

  const performSearch = async (query) => {
    setSearchLoading(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
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
    <div className="min-h-screen">
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in-up ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : message.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="hero-gradient pt-16 pb-24">
        <div className="section-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up tracking-tight">
              Discover your next
              <span className="gradient-text block mt-2">favorite movie</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-fade-in-up stagger-1 leading-relaxed">
              Track, rate, and explore movies like never before.
              <br className="hidden md:block" />
              Your personal cinema companion.
            </p>

            <div className="max-w-2xl mx-auto animate-fade-in-up stagger-2 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for any movie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 pl-14 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg hover:shadow-xl"
                />
                <svg
                  className="absolute left-5 top-5 h-6 w-6 text-gray-400"
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

              <SearchResults
                movies={searchResults}
                onAddToWatchlist={addToWatchlist}
                loading={searchLoading}
                onClose={() => setSearchQuery('')}
              />

              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>10,000+ Movies</span>
                </span>
                <span className="text-gray-300">•</span>
                <span>Powered by TMDB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="section-container">
          <Recommendations />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="section-container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Trending Now
              </h2>
              <p className="text-lg text-gray-600">
                The most popular movies everyone is talking about
              </p>
            </div>
          </div>

          {trendingMovies.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {trendingMovies.map((movie, index) => (
                <div key={movie.id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                  <MovieCard
                    movie={movie}
                    onAddToWatchlist={() => addToWatchlist(movie)}
                    showActions={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="section-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-6 animate-float">
              <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why CineList?
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              More than just a watchlist. Track your journey through cinema, discover hidden gems, and never forget a great movie again.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="glass-effect rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Watchlists</h3>
                <p className="text-gray-600">
                  Organize and prioritize movies you want to watch
                </p>
              </div>

              <div className="glass-effect rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rate & Review</h3>
                <p className="text-gray-600">
                  Share your thoughts and track your ratings
                </p>
              </div>

              <div className="glass-effect rounded-3xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-gray-600">
                  Get personalized suggestions based on your taste
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
