import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ productId, reviews = [], onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMsg('Please log in to submit a review.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reviews', { productId, rating, comment });
      setComment('');
      setMsg('Thank you! Your review has been submitted.');
      if (onReviewAdded) onReviewAdded();
    } catch (e) {
      setMsg('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gold/20">
      <h3 className="text-2xl font-serif text-gold mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-gold" />
        Customer Reviews & Ratings
      </h3>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-ink/80 border border-gold/30 rounded-2xl p-6 mb-8 shadow-lg">
          <h4 className="text-sm font-semibold text-ivory mb-3">Write a Customer Review</h4>
          
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-ivory/70 mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-gold fill-gold'
                      : 'text-ivory/30'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            rows="3"
            placeholder="Share your thoughts on the craftsmanship, fit, and sparkle..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-ink border border-gold/20 rounded-xl text-ivory placeholder-ivory/40 text-sm focus:outline-none focus:border-gold mb-3"
            required
          />

          {msg && <p className="text-xs text-gold mb-3">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gold text-ink font-bold text-sm rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-8 text-center text-sm text-ivory/80">
          Please log in to submit a verified customer review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-ivory/50 italic">No reviews yet for this piece. Be the first to leave a review!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-ink/60 border border-gold/15 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-ivory">{rev.user_name || 'Verified Buyer'}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-gold fill-gold' : 'text-ivory/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-ivory/80">{rev.comment}</p>
              <span className="text-[10px] text-ivory/40 block">
                {new Date(rev.created_at || Date.now()).toLocaleDateString('en-IN')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
