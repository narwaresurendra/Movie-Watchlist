import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { ReviewModal } from '../components/ReviewModal';

export const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user, sortBy]);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from('movie_reviews')
        .select('*')
        .eq('user_id', user.id);

      if (sortBy === 'date-desc') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'date-asc') {
        query = query.order('created_at', { ascending: true });
      } else if (sortBy === 'rating-desc') {
        query = query.order('rating', { ascending: false });
      } else if (sortBy === 'rating-asc') {
        query = query.order('rating', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showMessage('Error loading reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('movie_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter((r) => r.id !== reviewId));
      showMessage('Review deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting review:', error);
      showMessage('Error deleting review', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFullStar = rating >= i;
      const isHalfStar = rating >= i - 0.5 && rating < i;

      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            isFullStar || isHalfStar ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {isHalfStar ? (
            <>
              <defs>
                <linearGradient id={`half-star-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#half-star-${i})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </>
          ) : (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          )}
        </svg>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {message && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-xl animate-fade-in-up ${
              message.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-lg text-gray-600">
            Your movie ratings and reviews in one place
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="glass-effect rounded-3xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">
                  {getAverageRating()}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex space-x-1">
                  {renderStars(parseFloat(getAverageRating()))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            All Reviews ({reviews.length})
          </h2>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
            <p className="text-gray-400">
              Watch movies and leave reviews to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="glass-effect rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {review.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                        alt={review.title}
                        className="w-24 h-36 object-cover rounded-xl shadow-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {review.title}
                          </h3>
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatDate(review.created_at)}
                            {review.updated_at !== review.created_at && ' (edited)'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit review"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {review.review_text && (
                        <div className="bg-gray-50 rounded-xl p-4 mt-3">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {review.review_text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewModal
          movie={selectedReview}
          existingReview={selectedReview}
          onClose={() => setSelectedReview(null)}
          onSubmit={() => {
            fetchReviews();
            showMessage('Review updated successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};
