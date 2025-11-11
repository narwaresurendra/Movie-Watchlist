import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { searchMovies, formatMovieData } from '../services/tmdb';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [showQueryInput, setShowQueryInput] = useState(false);
  const [lastAddedMovie, setLastAddedMovie] = useState(null);
  const { user } = useAuth();

  const quickPrompts = [
    'Suggest action movies released after 2020',
    'What are some good romantic comedies?',
    'Show me sci-fi movies with mind-bending plots',
    'Recommend critically acclaimed dramas',
    'What horror movies are worth watching?',
    'Suggest family-friendly animated movies',
  ];

  const generateRecommendations = async (customQuery = null) => {
    const query = customQuery || userQuery;

    if (!query.trim()) {
      showMessage('Please enter a query or select a quick prompt', 'info');
      return;
    }

    setLoading(true);
    setShowQueryInput(false);

    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('not_interested_movies')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: watchedMovies } = await supabase
        .from('watched_movies')
        .select('title, rating')
        .eq('user_id', user.id)
        .gte('rating', 4.0)
        .order('rating', { ascending: false })
        .limit(5);

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY;

      if (!apiKey) {
        const fallbackRecs = await getFallbackRecommendations(query);
        setRecommendations(fallbackRecs);
        setLoading(false);
        return;
      }

      let contextInfo = '';
      if (watchedMovies && watchedMovies.length > 0) {
        const movieTitles = watchedMovies.map(m => `${m.title} (${m.rating}★)`).join(', ');
        contextInfo = ` User has enjoyed: ${movieTitles}.`;
      }

      const prompt = `${query}${contextInfo} Suggest 8 movies. For each movie, provide: 1) The exact movie title, 2) Release year, 3) A brief explanation (max 30 words) of why it's recommended. Format as JSON array with objects containing: title, year, reason.`;

      let aiRecommendations = [];

      if (import.meta.env.VITE_OPENAI_API_KEY) {
        aiRecommendations = await getOpenAIRecommendations(prompt);
      } else if (import.meta.env.VITE_CLAUDE_API_KEY) {
        aiRecommendations = await getClaudeRecommendations(prompt);
      }

      const enrichedRecs = await enrichRecommendationsWithTMDB(aiRecommendations, preferences?.not_interested_movies || []);
      setRecommendations(enrichedRecs);
      setUserQuery('');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      showMessage('Error generating recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getOpenAIRecommendations = async (prompt) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  };

  const getClaudeRecommendations = async (prompt) => {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.content[0].text;
    return JSON.parse(content);
  };

  const getFallbackRecommendations = async (query) => {
    const queryLower = query.toLowerCase();
    let searchTerms = [];

    if (queryLower.includes('action')) {
      searchTerms = ['Mad Max Fury Road', 'John Wick', 'Mission Impossible', 'The Dark Knight'];
    } else if (queryLower.includes('romantic') || queryLower.includes('romance')) {
      searchTerms = ['The Notebook', 'Pride and Prejudice', 'La La Land', 'About Time'];
    } else if (queryLower.includes('comedy')) {
      searchTerms = ['The Grand Budapest Hotel', 'Superbad', 'The Big Lebowski', 'Knives Out'];
    } else if (queryLower.includes('sci-fi') || queryLower.includes('science fiction')) {
      searchTerms = ['Inception', 'Interstellar', 'The Matrix', 'Arrival'];
    } else if (queryLower.includes('horror')) {
      searchTerms = ['The Conjuring', 'Get Out', 'A Quiet Place', 'Hereditary'];
    } else if (queryLower.includes('drama')) {
      searchTerms = ['The Shawshank Redemption', 'Forrest Gump', 'The Godfather', 'Parasite'];
    } else {
      searchTerms = ['The Shawshank Redemption', 'The Dark Knight', 'Inception', 'Interstellar'];
    }

    const recommendations = [];
    for (const title of searchTerms.slice(0, 8)) {
      const results = await searchMovies(title);
      if (results && results.length > 0) {
        recommendations.push({
          ...results[0],
          aiReason: `Popular ${queryLower.includes('action') ? 'action' : queryLower.includes('comedy') ? 'comedy' : ''} movie matching your query`,
        });
      }
    }
    return recommendations;
  };

  const enrichRecommendationsWithTMDB = async (aiRecs, notInterested) => {
    const enriched = [];

    for (const rec of aiRecs) {
      const results = await searchMovies(rec.title);
      if (results && results.length > 0) {
        const movie = results[0];
        if (!notInterested.includes(movie.id)) {
          enriched.push({
            ...movie,
            aiReason: rec.reason,
          });
        }
      }
      if (enriched.length >= 8) break;
    }

    return enriched;
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
      const { data: inserted, error } = await supabase
        .from('watchlist')
        .insert([{ ...movieData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setLastAddedMovie({ ...inserted, title: movie.title });
      showMessage('Added to watchlist!', 'success-undo');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      showMessage('Error adding to watchlist', 'error');
    }
  };

  const removeLastAdded = async () => {
    if (!lastAddedMovie) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', lastAddedMovie.id);

      if (error) throw error;

      setLastAddedMovie(null);
      setMessage('');
      showMessage('Removed from watchlist', 'success');
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      showMessage('Error removing from watchlist', 'error');
    }
  };

  const markNotInterested = async (movieId) => {
    try {
      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('not_interested_movies')
        .eq('user_id', user.id)
        .maybeSingle();

      const notInterested = prefs?.not_interested_movies || [];
      notInterested.push(movieId);

      const { error } = await supabase
        .from('user_preferences')
        .update({ not_interested_movies: notInterested })
        .eq('user_id', user.id);

      if (error) throw error;

      setRecommendations(recommendations.filter(r => r.id !== movieId));
      showMessage('Marked as not interested', 'success');
    } catch (error) {
      console.error('Error marking not interested:', error);
      showMessage('Error updating preferences', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="glass-effect rounded-3xl p-8 mb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Movie Recommendations</h2>
            <p className="text-gray-600">Ask for movie suggestions by genre, mood, theme, or your preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {!showQueryInput ? (
            <button
              onClick={() => setShowQueryInput(true)}
              className="w-full btn-primary py-4 text-base flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Ask for Movie Recommendations</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateRecommendations()}
                  placeholder="e.g., 'Suggest action movies from 2020+' or 'Romantic comedies like The Proposal'"
                  className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={() => generateRecommendations()}
                  disabled={loading || !userQuery.trim()}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">Quick prompts:</span>
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => generateRecommendations(prompt)}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {message && typeof message === 'string' ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{message}</p>
        </div>
      ) : message && (
        <div
          className={`mb-4 rounded-2xl ${
            message.type === 'success-undo' || message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : message.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}
        >
          <div className={`${message.type === 'success-undo' ? 'flex items-center justify-between p-4' : 'p-4'}`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{message.text}</span>
            </div>
            {message.type === 'success-undo' && lastAddedMovie && (
              <button
                onClick={removeLastAdded}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Generating personalized recommendations...</p>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Recommended for You</h3>
            <button
              onClick={() => setShowQueryInput(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Try another query
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((movie) => (
              <div key={movie.id} className="glass-effect rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{movie.release_date?.split('-')[0]}</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3">
                    <p className="text-gray-700 text-xs line-clamp-2">{movie.aiReason}</p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => addToWatchlist(movie)}
                      className="w-full btn-primary py-2 text-sm"
                    >
                      Add to Watchlist
                    </button>
                    <button
                      onClick={() => markNotInterested(movie.id)}
                      className="w-full btn-secondary py-2 text-sm border-2 border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      Not Interested
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
