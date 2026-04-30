import { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    fetchReviews();
    if (user) checkIfCanReview();
  }, [productId, user]);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${productId}`);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // check if user has a delivered order with this product
  const checkIfCanReview = async () => {
    try {
      const { data } = await API.get('/orders/my');
      const hasDelivered = data.some(order =>
        order.status === 'delivered' &&
        order.items.some(item =>
          item.product?._id === productId || item.product === productId
        )
      );
      setCanReview(hasDelivered);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    if (form.rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!form.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setSubmitting(true);
    try {
      await API.post(`/reviews/${productId}`, form);
      toast.success('Review submitted successfully ⭐');
      setForm({ rating: 0, comment: '' });
      setShowForm(false);
      setAlreadyReviewed(true);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/reviews/${productId}`);
      toast.success('Review deleted');
      setAlreadyReviewed(false);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  // check if current user already reviewed
  const userReview = reviews.find(r => r.user === user?._id || r.user?._id === user?._id);

  // rating breakdown — count per star
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  return (
    <div className="mt-12">
      <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">

          {/* Average Score */}
          <div className="flex flex-col items-center justify-center sm:w-40 flex-shrink-0">
            <p className="font-heading text-5xl font-bold text-gray-800 dark:text-white">
              {averageRating > 0 ? Number(averageRating).toFixed(1) : '—'}
            </p>
            <StarRating rating={Math.round(averageRating)} size={18} />
            <p className="text-xs text-gray-400 mt-1">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-100 dark:bg-gray-800" />

          {/* Breakdown bars */}
          <div className="flex-1 flex flex-col gap-2 justify-center">
            {ratingBreakdown.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">{star}</span>
                <Star size={12} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Button / Form */}
      {user && canReview && !userReview && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <MessageSquare size={15} />
              Write a Review
            </button>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                Your Review
              </h3>

              {/* Star selector */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Rating
                </label>
                <StarRating
                  rating={form.rating}
                  onRate={(r) => setForm({ ...form, rating: r })}
                  mode="input"
                  size={28}
                />
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Comment
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your experience with this product..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : 'Submit Review'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setForm({ rating: 0, comment: '' }); }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-400 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Not eligible message */}
      {user && !canReview && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400">
            💡 Only customers who have received this product can write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={36} strokeWidth={1} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {review.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size={13} />
                  {/* Delete button — only for own review */}
                  {user && (review.user === user._id || review.user?._id === user._id) && (
                    <button
                      onClick={handleDelete}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;