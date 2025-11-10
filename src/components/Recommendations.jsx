import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { searchMovies, formatMovieData } from '../services/tmdb';

export const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const { data: watchedMovies } = await supabase
        .from('watched_movies')
        .select('*')
        .eq('user_id', user.id)
        .gte('rating', 4.0)
        .order('rating', { ascending: false });

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('not_interested_movies')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!watchedMovies || watchedMovies.length === 0) {
        setMessage('Watch and rate some movies with 4+ stars to get personalized recommendations!');
        setLoading(false);
        return;
      }

      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_CLAUDE_API_KEY;

      if (!apiKey) {
        const fallbackRecs = await getFallbackRecommendations(watchedMovies);
        setRecommendations(fallbackRecs);
        setLoading(false);
        return;
      }

      const movieTitles = watchedMovies.slice(0, 10).map(m => `${m.title} (${m.release_year}) - Rating: ${m.rating}`).join(', ');

      const prompt = `Based on these highly-rated movies: ${movieTitles}. Suggest 8 similar movies. For each movie, provide: 1) The exact movie title, 2) Release year, 3) A brief explanation (max 30 words) of why it's recommended. Format as JSON array with objects containing: title, year, reason.`;

      let aiRecommendations = [];

      if (import.meta.env.VITE_OPENAI_API_KEY) {
        aiRecommendations = await getOpenAIRecommendations(prompt);
      } else if (import.meta.env.VITE_CLAUDE_API_KEY) {
        aiRecommendations = await getClaudeRecommendations(prompt);
      }

      const enrichedRecs = await enrichRecommendationsWithTMDB(aiRecommendations, preferences?.not_interested_movies || []);
      setRecommendations(enrichedRecs);
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

  const getFallbackRecommendations = async (watchedMovies) => {
    const fallbackTitles = [
      'The Shawshank Redemption', 'The Godfather', 'The Dark Knight',
      'Inception', 'Interstellar', 'Pulp Fiction', 'Forrest Gump',
      'The Matrix'
    ];

    const recommendations = [];
    for (const title of fallbackTitles.slice(0, 6)) {
      const results = await searchMovies(title);
      if (results && results.length > 0) {
        recommendations.push({
          ...results[0],
          aiReason: 'Highly rated classic movie that many people enjoy',
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
    <div className="bg-slate-800 rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Get New Recommendations'}
        </button>
      </div>

      {message && typeof message === 'string' ? (
        <div className="text-center py-8">
          <p className="text-slate-400">{message}</p>
        </div>
      ) : message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/50 text-green-400'
              : message.type === 'error'
              ? 'bg-red-500/10 border border-red-500/50 text-red-400'
              : 'bg-blue-500/10 border border-blue-500/50 text-blue-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((movie) => (
            <div key={movie.id} className="bg-slate-700 rounded-lg overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                <p className="text-slate-400 text-sm mb-2">{movie.release_date?.split('-')[0]}</p>
                <p className="text-slate-300 text-xs mb-3 line-clamp-2">{movie.aiReason}</p>
                <div className="space-y-2">
                  <button
                    onClick={() => addToWatchlist(movie)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-xs font-medium transition"
                  >
                    Add to Watchlist
                  </button>
                  <button
                    onClick={() => markNotInterested(movie.id)}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white py-1.5 px-3 rounded text-xs font-medium transition"
                  >
                    Not Interested
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
