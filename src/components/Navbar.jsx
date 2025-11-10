import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="glass-effect-dark sticky top-0 z-50 border-b border-white/5">
      <div className="section-container">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110">
                🎬
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">
                CineList
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Discover
              </Link>
              <Link
                to="/watchlist"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/watchlist')
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Watchlist
              </Link>
              <Link
                to="/watched"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive('/watched')
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
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
                className="flex items-center space-x-3 px-3 py-2 rounded-full hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/10 group-hover:ring-white/20 transition-all">
                  <span className="text-sm font-semibold text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-white">{profile?.username}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-52 glass-effect rounded-2xl py-2 shadow-2xl animate-slide-down">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors rounded-xl mx-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </div>
                  </Link>
                  <div className="my-2 h-px bg-white/10 mx-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors rounded-xl mx-2"
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
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
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
        <div className="md:hidden glass-effect-dark border-t border-white/5 animate-slide-down">
          <div className="section-container py-6 space-y-2">
            <Link
              to="/"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/') ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Discover
            </Link>
            <Link
              to="/watchlist"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/watchlist') ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              My Watchlist
            </Link>
            <Link
              to="/watched"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/watched') ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Watched Movies
            </Link>
            <Link
              to="/profile"
              className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                isActive('/profile') ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Profile
            </Link>
            <div className="pt-4">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-3 rounded-2xl text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
