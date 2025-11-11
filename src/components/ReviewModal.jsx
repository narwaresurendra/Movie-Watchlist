import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

export const ReviewModal = ({ movie, existingReview, onClose, onSubmit }) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        user_id: user.id,
        movie_id: movie.movie_id || movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        rating: rating,
        review_text: reviewText.trim() || null,
      };

      if (existingReview) {
        const { error: updateError } = await supabase
          .from('movie_reviews')
          .update({
            rating: rating,
            review_text: reviewText.trim() || null,
          })
          .eq('id', existingReview.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('movie_reviews')
          .insert([reviewData]);

        if (insertError) throw insertError;
      }

      onSubmit?.();
      onClose();
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
    setError('');
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoveredRating || rating;

    for (let i = 1; i <= 5; i++) {
      const isFullStar = displayRating >= i;
      const isHalfStar = displayRating >= i - 0.5 && displayRating < i;

      stars.push(
        <div
          key={i}
          className="relative cursor-pointer"
          onMouseLeave={() => setHoveredRating(0)}
        >
          <div className="flex">
            <div
              className="w-8"
              onMouseEnter={() => handleStarHover(i - 0.5)}
              onClick={() => handleStarClick(i - 0.5)}
            >
              {isHalfStar ? (
                <svg className="w-16 h-16 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id={`half-${i}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#E5E7EB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${i})`}
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              ) : (
                <svg
                  className={`w-16 h-16 transition-colors ${
                    isFullStar ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </div>
            <div
              className="w-8 -ml-8"
              onMouseEnter={() => handleStarHover(i)}
              onClick={() => handleStarClick(i)}
            >
              <svg
                className={`w-16 h-16 transition-colors ${
                  isFullStar ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4 flex-1">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-20 h-30 object-cover rounded-xl shadow-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {existingReview ? 'Edit Review' : 'Write a Review'}
                </h2>
                <p className="text-lg text-gray-700">{movie.title}</p>
                {movie.release_year && (
                  <p className="text-sm text-gray-500">{movie.release_year}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                {renderStars()}
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {rating > 0 ? rating.toFixed(1) : '-'}
                </span>
                <span className="text-sm text-gray-500">out of 5 stars</span>
              </div>
            </div>

            {rating > 0 && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Your Review <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this movie... What did you like or dislike? Would you recommend it?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-400"
                  rows="6"
                  maxLength="1000"
                />
                <div className="mt-2 text-right text-sm text-gray-500">
                  {reviewText.length}/1000 characters
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {existingReview ? 'Updating...' : 'Submitting...'}
                  </span>
                ) : (
                  existingReview ? 'Update Review' : 'Submit Review'
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
