import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HotelData } from "../../types/Hotels";
import { Review } from "../../types/Review";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { GradientButton } from "../Button";

type HotelDetailsProps = {
  hotel: HotelData | null;
  reviews: Review[];
  userInfo: { [key: string]: { firstName: string; lastName: string } };
  formatToAMPM: (timeString: string) => string;
  renderStars: (rating: number) => React.ReactNode;
  isBookmarked: boolean;
  canBookmark: boolean;
  handleBookmarkToggle: () => void;
  handleDeleteHotel: () => void;
  setIsReviewModalOpen: (open: boolean) => void;
  userId: number | null;
};

const HotelDetails: React.FC<HotelDetailsProps> = ({
  hotel,
  reviews,
  userInfo,
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
  if (!hotel) return null;

  const defaultImage =
    "https://archive.org/download/placeholder-image/placeholder-image.jpg";
  const isAdmin = sessionStorage.getItem("role") === "admin";

  const handleBookClick = () => navigate(`/create-bookings/${hotel.id}`);
  const handleUpdateHotel = () => navigate(`/create-hotel/${hotel.id}`);

  return (
    <div className="bg-gray-50 min-h-screen select-none">
      {/* Hero */}
      <div className="relative h-[450px] w-full rounded-b-2xl overflow-hidden">
        <img
          src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-6 left-6 text-white flex items-center justify-between w-[calc(100%-3rem)]">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient">
              {hotel.name}
            </h1>
            <p className="mt-1 text-lg sm:text-2xl font-light opacity-90 max-w-2xl">
              {hotel.address}
            </p>
          </div>
          <button
            onClick={canBookmark ? handleBookmarkToggle : undefined}
            className={`text-2xl hover:scale-110 transition ${
              canBookmark ? "text-white" : "text-gray-400 cursor-not-allowed"
            }`}
            title={canBookmark ? "Bookmark" : "Login to bookmark"}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid md:grid-cols-3 gap-8">
        {/* Left: Info + Reviews */}
        <div className="md:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition">
            <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Contact & Timing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-700">
                <strong>Address:</strong> {hotel.address}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Phone:</strong>{" "}
                {hotel.contact ? formatPhoneNumber(hotel.contact) : "N/A"}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-4">Pricing & Timing</h3>
              <p className="text-gray-700">
                <strong>Price Range:</strong> ${hotel.minPrice} - ${hotel.maxPrice}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Check-In:</strong>{" "}
                {hotel.checkIn ? formatToAMPM(hotel.checkIn) : "N/A"}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Check-Out:</strong>{" "}
                {hotel.checkOut ? formatToAMPM(hotel.checkOut) : "N/A"}
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              {userId && (
                <GradientButton
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-pink-500 hover:to-yellow-500 transition-all hover:scale-105"
                >
                  Write a Review
                </GradientButton>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div
                className="max-h-[8rem] overflow-y-auto divide-y divide-gray-200 pr-2"
                style={{
                  scrollbarWidth: "none", // Firefox
                }}
              >
                {/* Hide scrollbar for Webkit browsers */}
                <style>
                  {`
                    .scroll-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                <div className="scroll-hide">
                  {reviews.map((review, index) => (
                    <div key={review.id ?? index} className="py-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 text-sm">
                          {userInfo[review.userId]?.firstName}{" "}
                          {userInfo[review.userId]?.lastName}
                        </p>
                        <div className="text-yellow-400 text-sm">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="mt-1 text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sticky Booking Panel */}
        <div className="space-y-6 sticky top-20">
          {/* Booking Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition space-y-4">
            <h3 className="text-lg font-semibold">Your Stay</h3>
            <p className="text-gray-700">${hotel.minPrice} - ${hotel.maxPrice}</p>

            {userId && (
              <GradientButton
                onClick={handleBookClick}
                className="w-full px-6 py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-pink-500 hover:to-yellow-500 transition-all hover:scale-105"
              >
                Book Now
              </GradientButton>
            )}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition space-y-4">
              <h3 className="text-lg font-semibold">Admin Actions</h3>
              <div className="flex flex-col gap-3">
                <GradientButton
                  onClick={handleUpdateHotel}
                  className="w-full px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-indigo-500 hover:to-pink-500 transition-all hover:scale-105"
                >
                  Update Hotel
                </GradientButton>
                <GradientButton
                  onClick={handleDeleteHotel}
                  className="w-full px-6 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 hover:from-pink-500 hover:to-yellow-500 transition-all hover:scale-105"
                >
                  Delete Hotel
                </GradientButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;