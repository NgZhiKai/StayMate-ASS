import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useBookingContext } from "../../contexts/BookingContext";

import CreateBookingForm from "../../components/Booking/CreateBookingForm";
import AnimatedModal from "../../components/Modal/Modal";
import useBookingLogic from "../../hooks/useBookingLogic";

const CreateBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams<{ hotelId: string }>();
  const { refreshNotifications } = useNotificationContext();
  const { refreshBookings } = useBookingContext();
  const userId = Number(sessionStorage.getItem("userId") || 0);

  const {
    bookingData,
    availableRooms,
    isSubmitting,
    validationErrors,
    handleInputChange,
    handleRoomSelect,
    handleSubmit,
    showModal,
    modalMessage,
    handleModalClose,
    showLoginPrompt,
  } = useBookingLogic(userId, Number(hotelId), refreshNotifications, async () => {
    // Refresh booking context after success
    await refreshBookings();
    navigate("/"); // go to home page after booking
  });

  if (showLoginPrompt)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-400 to-pink-400">
        <p className="text-white text-lg font-semibold">Please log in to create a booking.</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 min-h-screen select-none pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <CreateBookingForm
            bookingData={bookingData}
            rooms={availableRooms}
            isSubmitting={isSubmitting}
            errors={validationErrors}
            handleInputChange={handleInputChange}
            handleRoomSelect={handleRoomSelect}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {showModal && (
        <AnimatedModal
          message={modalMessage}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CreateBookingPage;