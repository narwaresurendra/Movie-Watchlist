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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Rate this movie</h2>
        <p className="text-slate-300 mb-6">{movie.title}</p>

        <div className="flex justify-center mb-6">
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating < 0.5}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};
