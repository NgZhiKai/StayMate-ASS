import React from "react";
import { FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HotelData } from "../../types/Hotels";
import { Review } from "../../types/Review";

type HotelDetailsProps = {
  hotel: HotelData | null;
  reviews: Review[];
  userInfo: { [key: string]: { firstName: string; lastName: string } };
  getPricingRange: () => string;
  formatToAMPM: (timeString: string) => string;
  renderStars: (rating: number) => React.ReactNode;
  isBookmarked: boolean;
  canBookmark: boolean; // whether user can bookmark
  handleBookmarkToggle: () => void;
  handleDeleteHotel: () => void;
  setIsReviewModalOpen: (open: boolean) => void;
  userId: number | null; // allow null for guests
};

const HotelDetails: React.FC<HotelDetailsProps> = ({
  hotel,
  reviews,
  userInfo,
  getPricingRange,
  formatToAMPM,
  renderStars,
  isBookmarked,
  canBookmark,
  handleBookmarkToggle,
  handleDeleteHotel,
  setIsReviewModalOpen,
  userId,
}) => {
  const navigate = useNavigate();
  const defaultImage = "https://archive.org/download/placeholder-image/placeholder-image.jpg";
  const isAdmin = sessionStorage.getItem("role") === "admin";

  if (!hotel) return null;

  const formatPhoneNumber = (raw: string) =>
    raw && raw.length > 4 ? `(+${raw.slice(0, 2)}) ${raw.slice(2)}` : raw;

  const handleBookClick = () => navigate(`/create-bookings/${hotel.id}`);
  const handleUpdateHotel = () => navigate(`/create-hotel/${hotel.id}`);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 select-none">
      {/* Hero */}
      <div className="relative h-[420px] w-full">
        <img
          src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{hotel.name}</h1>
              <p className="mt-2 text-lg opacity-90">{hotel.address}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={canBookmark ? handleBookmarkToggle : undefined}
                className={`text-2xl hover:scale-110 transition ${canBookmark ? "text-white" : "text-gray-400 cursor-not-allowed"}`}
                title={canBookmark ? "Bookmark" : "Login to bookmark"}
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              {userId && !isAdmin && (
                <button
                  onClick={handleBookClick}
                  className="px-6 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-pink-500 hover:to-yellow-500 transition-all"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12">
        {/* About */}
        <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
          <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p className="text-gray-700"><strong>Address:</strong> {hotel.address}</p>
            <p className="text-gray-700 mt-2"><strong>Phone:</strong> {hotel.contact ? formatPhoneNumber(hotel.contact) : "N/A"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4">Pricing & Timing</h3>
            <p className="text-gray-700"><strong>Price Range:</strong> {getPricingRange()}</p>
            <p className="text-gray-700 mt-2"><strong>Check-In:</strong> {hotel.checkIn ? formatToAMPM(hotel.checkIn) : "N/A"}</p>
            <p className="text-gray-700 mt-2"><strong>Check-Out:</strong> {hotel.checkOut ? formatToAMPM(hotel.checkOut) : "N/A"}</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            {userId && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-2 font-semibold text-white rounded-full bg-green-500 hover:bg-green-600 transition-all"
              >
                Write a Review
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
              {reviews.map((review) => (
                <div key={review.userId + review.created} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                  <p className="font-semibold text-gray-900">{userInfo[review.userId]?.firstName} {userInfo[review.userId]?.lastName}</p>
                  <div className="mt-1">{renderStars(review.rating)}</div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin */}
        {isAdmin && (
          <div className="flex gap-4">
            <button
              onClick={handleUpdateHotel}
              className="px-6 py-3 font-semibold text-white rounded-full bg-blue-500 hover:bg-blue-600 transition-all"
            >
              Update Hotel
            </button>
            <button
              onClick={handleDeleteHotel}
              className="px-6 py-3 font-semibold text-white rounded-full bg-red-500 hover:bg-red-600 transition-all"
            >
              Delete Hotel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;