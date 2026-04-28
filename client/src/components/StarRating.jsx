import { Star } from 'lucide-react';

// mode = 'display' (read only) or 'input' (clickable)
const StarRating = ({ rating, onRate, mode = 'display', size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => mode === 'input' && onRate(star)}
          disabled={mode === 'display'}
          className={`transition-transform ${
            mode === 'input'
              ? 'hover:scale-125 cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;