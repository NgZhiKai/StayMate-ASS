import { useState } from "react";
import { useParams } from "react-router-dom";
import { HotelDetails } from "../../components/Hotel";
import { LoadingSpinner } from "../../components/Misc";
import { ConfirmationModal, MessageModal, ReviewModal } from "../../components/Modal";
import { useBookmark } from "../../hooks/useBookmark";
import { useHotelActions } from "../../hooks/useHotelActions";
import { useHotelData } from "../../hooks/useHotelData";
import { formatToAMPM, getPricingRange, renderStars } from "../../utils/hotelUtils";

const HotelDetailsPage = () => {
  const { id } = useParams();
  const hotelId = Number(id);
  const currentUserId = sessionStorage.getItem("userId")
    ? Number(sessionStorage.getItem("userId"))
    : null;

  const { loading, hotel, reviews, userInfo, setReviews, setUserInfo } = useHotelData(hotelId);
  const { isBookmarked, canBookmark, toggleBookmark } = useBookmark(currentUserId, hotel?.id || null);

  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isMessageOpen,
    setIsMessageOpen,
    messageType,
    message,
    setMessageType,
    setMessage,
    confirmDeletion,
    handleReviewSubmitted
  } = useHotelActions(hotel?.id || null, setReviews, setUserInfo);

  // NEW: separate state for ReviewModal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );

  if (!hotel) return <div className="text-center py-20">Hotel not found.</div>;

  return (
    <>
      <HotelDetails
        hotel={hotel}
        reviews={reviews}
        userInfo={userInfo}
        getPricingRange={() => getPricingRange(hotel.rooms)}
        formatToAMPM={formatToAMPM}
        renderStars={renderStars}
        isBookmarked={isBookmarked}
        canBookmark={canBookmark}
        handleBookmarkToggle={toggleBookmark}
        handleDeleteHotel={() => setIsDeleteModalOpen(true)}
        userId={currentUserId}
        setIsReviewModalOpen={() => setIsReviewModalOpen(true)} // now opens only ReviewModal
      />

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletion}
        message="Are you sure you want to delete this hotel?"
      />

      {/* General message modal */}
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        message={message}
        type={messageType}
      />

      {/* Review modal */}
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