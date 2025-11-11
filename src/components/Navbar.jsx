import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchWatchlistCount();
      const channel = supabase
        .channel('watchlist-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'watchlist',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchWatchlistCount();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchWatchlistCount = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('watchlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setWatchlistCount(count || 0);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="glass-effect-nav sticky top-0 z-50">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110">
                🎬
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">
                CineList
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Discover
              </Link>
              <Link
                to="/watchlist"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                  isActive('/watchlist')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Watchlist</span>
                  {watchlistCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {watchlistCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link
                to="/watched"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/watched')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Watched
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">{profile?.username}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-52 glass-effect rounded-2xl py-2 shadow-xl animate-slide-down">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-xl mx-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </div>
                  </Link>
                  <div className="my-2 h-px bg-gray-200 mx-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-xl mx-2"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden glass-effect border-t border-gray-200 animate-slide-down">
          <div className="section-container py-6 space-y-2">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Discover
            </Link>
            <Link
              to="/watchlist"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/watchlist') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>My Watchlist</span>
                </span>
                {watchlistCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                    {watchlistCount}
                  </span>
                )}
              </span>
            </Link>
            <Link
              to="/watched"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/watched') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Watched Movies
            </Link>
            <Link
              to="/profile"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Profile
            </Link>
            <div className="pt-4">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-3 rounded-2xl text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
