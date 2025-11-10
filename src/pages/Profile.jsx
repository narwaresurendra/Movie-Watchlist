import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/tmdb';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    watchlistCount: 0,
    watchedCount: 0,
    averageRating: 0,
  });
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentMovies();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: watchlistData } = await supabase
        .from('watchlist')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      const { data: watchedData } = await supabase
        .from('watched_movies')
        .select('rating')
        .eq('user_id', user.id);

      const watchedCount = watchedData?.length || 0;
      const averageRating =
        watchedCount > 0
          ? watchedData.reduce((sum, movie) => sum + parseFloat(movie.rating), 0) / watchedCount
          : 0;

      setStats({
        watchlistCount: watchlistData?.length || 0,
        watchedCount,
        averageRating,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMovies = async () => {
    try {
      const { data } = await supabase
        .from('watched_movies')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_date', { ascending: false })
        .limit(5);

      setRecentMovies(data || []);
    } catch (error) {
      console.error('Error fetching recent movies:', error);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut();
      navigate('/login');
    }
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                  {profile?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{profile?.username}</h1>
                <p className="text-blue-100 mt-1">Movie Enthusiast</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold text-white mb-6">Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">📋</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.watchlistCount}
                </div>
                <div className="text-slate-400">Movies in Watchlist</div>
              </div>

              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.watchedCount}
                </div>
                <div className="text-slate-400">Movies Watched</div>
              </div>

              <div className="bg-slate-700 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-slate-400">Average Rating</div>
              </div>
            </div>

            {stats.averageRating > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Rating Distribution</h3>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Your average rating:</span>
                    <span className="text-yellow-400 font-bold text-xl">
                      {stats.averageRating.toFixed(1)} / 5.0
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {recentMovies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Recently Watched</h3>
                <div className="space-y-3">
                  {recentMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-slate-700 rounded-lg p-4 flex items-center space-x-4 hover:bg-slate-600 transition"
                    >
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{movie.title}</h4>
                        <p className="text-slate-400 text-sm">{movie.release_year}</p>
                      </div>
                      <div className="text-yellow-400 font-bold text-lg">
                        {movie.rating.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
              <div className="space-y-3">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
