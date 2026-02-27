import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ratingApi } from "../../services/Hotel";
import { Review } from "../../types/Review";
import { GradientButton } from "../Button";

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

      const createdReview = await ratingApi.createReview(review);
      onReviewSubmitted(createdReview);
      setSuccessMessage("Review submitted successfully!");
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      setErrorMessage("Failed to submit review. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-gray-300/40 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 px-4 select-none">
        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-200/50">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition"
            onClick={onClose}
            aria-label="Close Modal"
          >
            &times;
          </button>

          {/* Title */}
          <h2 className="text-2xl text-center font-bold drop-shadow-lg bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient">
            Submit Your Review
          </h2>

          {userId === null || userId === 0 ? (
            <div className="text-center text-gray-700">
              <p className="mb-4">Please login to submit a review.</p>
              <GradientButton
                onClick={() => navigate("/login")}
                className="px-6 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
              >
                Login
              </GradientButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer text-2xl transition-transform transform ${
                        i < rating ? "text-yellow-500" : "text-gray-300"
                      } hover:scale-110`}
                      onClick={() => handleRatingClick(i + 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
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
                <p className="text-red-600 font-medium">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-600 font-medium">{successMessage}</p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <GradientButton
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2 border border-gray-300/50 rounded-full hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </GradientButton>
                <GradientButton
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-full shadow font-medium hover:bg-indigo-500 transition"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </GradientButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewModal;