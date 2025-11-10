import { useState } from 'react';
import { StarRating } from './StarRating';

export const RatingModal = ({ movie, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating < 0.5) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(rating);
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await onSubmit(3.0);
      onClose();
    } catch (error) {
      console.error('Error skipping rating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-effect rounded-3xl p-8 max-w-md w-full animate-fade-in-up shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate this movie</h2>
        <p className="text-gray-600 mb-8 text-lg">{movie.title}</p>

        <div className="flex flex-col items-center mb-8">
          <StarRating rating={rating} onRatingChange={setRating} />
          {rating > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              {rating >= 4.5 ? 'Amazing!' : rating >= 4.0 ? 'Great!' : rating >= 3.0 ? 'Good!' : rating >= 2.0 ? 'Okay' : 'Not great'}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleSubmit}
            disabled={loading || rating < 0.5}
            className="btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="btn-secondary py-3 disabled:opacity-50"
          >
            Skip for now
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-600 hover:text-gray-900 py-2 font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
