import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useBookingContext } from "../../contexts/BookingContext";

import { CreateBookingForm, BookingSummary, LoginPrompt } from "../../components/Booking";
import { AnimatedModal } from "../../components/Modal";
import { useBookingLogic } from "../../hooks";

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
    await refreshBookings();
    navigate("/"); // return home after booking
  });

  if (showLoginPrompt) return <LoginPrompt />;

  const selectedRooms = Object.entries(
    availableRooms.reduce<Record<string, number>>((acc, room) => {
      if (!acc[room.room_type]) acc[room.room_type] = 0;
      if (bookingData.roomIds.includes(room.id.roomId)) acc[room.room_type] += 1;
      return acc;
    }, {})
  ).filter(([_, count]) => count > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 pt-24 pb-12 px-4 md:px-8 select-none">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
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
        <div className="hidden lg:block">
          <BookingSummary
            bookingData={bookingData}
            selectedRooms={selectedRooms}
            isSubmitting={isSubmitting}
            onSubmit={() => handleSubmit({} as any)}
          />
        </div>
      </div>

      {showModal && <AnimatedModal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
};

export default CreateBookingPage;