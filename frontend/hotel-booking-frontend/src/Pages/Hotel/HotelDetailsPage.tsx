import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import HotelDetails from "../../components/Hotel/HotelDetails";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import MessageModal from "../../components/Modal/MessageModal";
import ReviewModal from "../../components/Modal/ReviewModal";

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color="#2563EB" />
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
        userId={currentUserId} // number | null
        setIsReviewModalOpen={() => setIsMessageOpen(true)}
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
        isOpen={isMessageOpen} // consider using separate review modal state
        onClose={() => setIsMessageOpen(false)}
        hotelId={hotel.id}
        userId={currentUserId} // number | null
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
};

export default HotelDetailsPage;