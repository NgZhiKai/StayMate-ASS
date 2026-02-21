import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import HotelDetails from "../../components/Hotel/HotelDetails";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import MessageModal from "../../components/Modal/MessageModal";
import ReviewModal from "../../components/Modal/ReviewModal";

import { useHotelData } from "../../hooks/useHotelData";
import { deleteHotel } from "../../services/Hotel/hotelApi";
import { addBookmark, getBookmarkedHotelIds, removeBookmark } from "../../services/User/bookmarkApi";
import { getUserInfo } from "../../services/User/userApi";

import { FaStar } from "react-icons/fa";

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotelId = Number(id);
  const currentUserId = Number(sessionStorage.getItem("userId"));

  const { loading, hotel, reviews, userInfo, setReviews, setUserInfo } = useHotelData(hotelId);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [message, setMessage] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // ====== HELPERS ======
  const formatToAMPM = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const getPricingRange = () => {
    if (!hotel?.rooms?.length) return "$0 - $0";
    const prices = hotel.rooms.map((r) => r.pricePerNight);
    return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          className={`text-xl mr-1 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  // ====== DELETE HOTEL ======
  const confirmDeletion = async () => {
    if (!hotel) return;
    try {
      await deleteHotel(hotel.id);
      setIsDeleteModalOpen(false);
      setMessage("Hotel deleted successfully!");
      setMessageType("success");
      setIsMessageOpen(true);
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMessage("Failed to delete hotel.");
      setMessageType("error");
      setIsMessageOpen(true);
    }
  };

  // ====== BOOKMARK ======
  const toggleBookmark = async () => {
    if (!currentUserId || !hotel) return;
    try {
      if (isBookmarked) {
        await removeBookmark(currentUserId, hotel.id);
        setIsBookmarked(false);
      } else {
        await addBookmark(currentUserId, hotel.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!currentUserId || !hotel) return;
      const bookmarked = await getBookmarkedHotelIds(currentUserId);
      if (Array.isArray(bookmarked)) {
        setIsBookmarked(bookmarked.includes(hotel.id));
      }
    };
    loadBookmarks();
  }, [hotel, currentUserId]);

  // ====== REVIEW SUBMIT ======
  const handleReviewSubmitted = async (review: any) => {
    if (!review) return;
    setReviews((prev) => [...prev, review]);
    const user = await getUserInfo(String(review.userId));
    setUserInfo((prev) => ({ ...prev, [review.userId]: user.user }));
    setIsReviewModalOpen(false);
  };

  // ====== RENDER ======
  if (loading) return <div className="flex justify-center items-center h-screen"><ClipLoader size={50} color="#2563EB" /></div>;
  if (!hotel) return <div className="text-center py-20">Hotel not found.</div>;

  return (
    <>
      <HotelDetails
        hotel={hotel}
        reviews={reviews}
        userInfo={userInfo}
        getPricingRange={getPricingRange}
        formatToAMPM={formatToAMPM}
        renderStars={renderStars}
        isBookmarked={isBookmarked}
        handleBookmarkToggle={toggleBookmark}
        handleDeleteHotel={() => setIsDeleteModalOpen(true)}
        userId={currentUserId}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletion}
        message="Are you sure you want to delete this hotel?"
      />

      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        message={message}
        type={messageType}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        hotelId={hotel.id}
        userId={currentUserId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
};

export default HotelDetailsPage;