import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎬</span>
              <span className="text-xl font-bold text-white">MovieList</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/watchlist"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                My Watchlist
              </Link>
              <Link
                to="/watched"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Watched Movies
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{profile?.username}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-1 border border-slate-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-slate-300 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium transition"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/watchlist"
              className="block text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium transition"
              onClick={() => setShowMobileMenu(false)}
            >
              My Watchlist
            </Link>
            <Link
              to="/watched"
              className="block text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium transition"
              onClick={() => setShowMobileMenu(false)}
            >
              Watched Movies
            </Link>
            <Link
              to="/profile"
              className="block text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium transition"
              onClick={() => setShowMobileMenu(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left text-slate-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
