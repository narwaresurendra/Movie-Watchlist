import { useState } from 'react';

export const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const renderStar = (index) => {
    const value = index + 0.5;
    const fullValue = index + 1;
    const displayRating = hoverRating || rating;
    const isHalfFilled = displayRating >= value && displayRating < fullValue;
    const isFilled = displayRating >= fullValue;

    return (
      <div key={index} className="relative inline-block">
        <svg
          className={`w-8 h-8 ${readOnly ? '' : 'cursor-pointer'} transition-colors duration-150`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="#fbbf24"
            strokeWidth="1.5"
            fill={isFilled || isHalfFilled ? '#fbbf24' : 'none'}
          />
          {isHalfFilled && (
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
        </svg>
        {!readOnly && (
          <>
            <div
              className="absolute inset-0 w-1/2"
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
            />
            <div
              className="absolute inset-0 left-1/2 w-1/2"
              onClick={() => handleClick(fullValue)}
              onMouseEnter={() => handleMouseEnter(fullValue)}
              onMouseLeave={handleMouseLeave}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      {(rating > 0 || hoverRating > 0) && (
        <span className="ml-2 text-sm text-slate-300 font-medium">
          {(hoverRating || rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};
