const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const searchMovies = async (query) => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results?.slice(0, 8) || [];
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}${path}`;
};

export const formatMovieData = (movie) => {
  return {
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    genres: movie.genre_ids || [],
    synopsis: movie.overview || 'No synopsis available',
  };
};
