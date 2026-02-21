import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../services/Hotel/ratingApi";
import { Review } from "../../types/Review";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: number;
  userId: number | null;
  onReviewSubmitted: (review: Review) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  userId,
  onReviewSubmitted,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setComment("");
      setRating(0);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const handleRatingClick = (value: number) => setRating(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return navigate("/login");

    if (rating === 0) {
      setErrorMessage("Please select a rating.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const review: Review = {
        hotelId,
        userId,
        comment,
        created: new Date().toISOString(),
        rating,
      };

      const createdReview = await createReview(review);
      onReviewSubmitted(createdReview);
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => onClose(), 1000); // auto-close after success
    } catch (error) {
      setErrorMessage("Failed to submit review. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3 py-2 bg-white/10 border border-white/30 text-white placeholder-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-200"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold text-center mb-6">Submit Your Review</h2>

          {userId === null || userId === 0 ? (
            <div className="text-center text-white/90">
              <p className="mb-4">Please login to submit a review.</p>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full text-white font-semibold shadow-lg hover:opacity-90 transition"
              >
                Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-lg font-medium mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer text-3xl transition-transform transform ${
                        i < rating ? "text-yellow-400" : "text-white/60"
                      } hover:scale-125`}
                      onClick={() => handleRatingClick(i + 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-lg font-medium mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review here..."
                  rows={4}
                  className={inputClass}
                  required
                />
              </div>

              {/* Error / Success */}
              {errorMessage && (
                <p className="text-red-200 font-semibold">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-200 font-semibold">{successMessage}</p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2 border border-white rounded-full hover:bg-white/20 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full shadow-lg font-semibold hover:opacity-90 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewModal;