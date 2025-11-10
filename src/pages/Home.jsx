import { useState } from 'react';
import { MovieCard } from '../components/MovieCard';

const DUMMY_TRENDING_MOVIES = [
  {
    id: 1,
    title: 'Inception',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    release_date: '2010-07-16',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
  },
  {
    id: 2,
    title: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    release_date: '2008-07-18',
    overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.',
  },
  {
    id: 3,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    release_date: '2014-11-07',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  },
  {
    id: 4,
    title: 'The Matrix',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    release_date: '1999-03-31',
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    release_date: '1994-10-14',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
  },
  {
    id: 6,
    title: 'Forrest Gump',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    release_date: '1994-07-06',
    overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
  },
  {
    id: 7,
    title: 'The Shawshank Redemption',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    release_date: '1994-09-23',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  },
  {
    id: 8,
    title: 'Fight Club',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    release_date: '1999-10-15',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
  },
];

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
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

            <div className="max-w-2xl mx-auto animate-fade-in-up stagger-2">
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
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Trending Now
              </h2>
              <p className="text-lg text-gray-600">
                The most popular movies everyone is talking about
              </p>
            </div>
            <button className="hidden md:block btn-secondary px-6 py-3">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {DUMMY_TRENDING_MOVIES.map((movie, index) => (
              <div key={movie.id} className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}>
                <MovieCard
                  movie={movie}
                  onAddToWatchlist={() => console.log('Add to watchlist:', movie.title)}
                  showActions={true}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="md:hidden btn-secondary px-8 py-3">
              View All Movies
            </button>
          </div>
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
