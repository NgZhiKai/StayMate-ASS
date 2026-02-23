import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, searchBookingsByDate } from "../services/Booking/bookingApi";
import { roomApi } from "../services/Hotel";
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";

const useBookingLogic = (
  userId: number,
  hotelId: number,
  refreshNotifications: () => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  const [bookingData, setBookingData] = useState<Booking>({
    userId,
    hotelId,
    roomIds: [],
    checkInDate: "",
    checkOutDate: "",
    totalAmount: 0,
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(!userId);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch rooms
  useEffect(() => {
    if (!hotelId) return;

    const fetchRooms = async () => {
      try {
        const roomsData = await roomApi.getHotelRooms(hotelId);
        const mappedRooms: Room[] = roomsData.map((r: any) => ({
          room_type: r.room_type || r.roomType || "Unknown",
          id: { hotelId: r.hotelId ?? r.id?.hotelId, roomId: r.roomId ?? r.id?.roomId },
          pricePerNight: r.pricePerNight ?? r.price,
          maxOccupancy: r.maxOccupancy ?? r.capacity ?? 2,
          status: r.status ?? "AVAILABLE",
        }));

        setAllRooms(mappedRooms);
        setAvailableRooms(mappedRooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, [hotelId]);

  // Update available rooms when date changes
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      const { checkInDate, checkOutDate } = bookingData;
      if (!checkInDate || !checkOutDate || allRooms.length === 0) return;

      try {
        const bookings = await searchBookingsByDate(checkInDate, checkOutDate);
        const bookedRoomIds = bookings
          .filter((b) => b.hotelId === hotelId)
          .map((b) => b.roomId);

        const available = allRooms.filter((r) => !bookedRoomIds.includes(r.id.roomId));
        setAvailableRooms(available);
      } catch {
        setAvailableRooms(allRooms);
      }
    };

    fetchAvailableRooms();
  }, [bookingData.checkInDate, bookingData.checkOutDate, allRooms, hotelId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (roomType: string, selectedCount: number) => {
    setBookingData((prev) => {
      const remainingRoomIds = prev.roomIds.filter((id) => {
        const room = availableRooms.find((r) => r.id.roomId === id);
        return room?.room_type !== roomType;
      });

      const roomsOfType = availableRooms.filter((r) => r.room_type === roomType);
      const selectedIds = roomsOfType.slice(0, selectedCount).map((r) => r.id.roomId);

      const updatedRoomIds = [...remainingRoomIds, ...selectedIds];

      const nights =
        prev.checkInDate && prev.checkOutDate
          ? Math.max(
              1,
              (new Date(prev.checkOutDate).getTime() - new Date(prev.checkInDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 1;

      const total = updatedRoomIds.reduce((sum, id) => {
        const room = availableRooms.find((r) => r.id.roomId === id);
        return room ? sum + room.pricePerNight * nights : sum;
      }, 0);

      return { ...prev, roomIds: updatedRoomIds, totalAmount: total };
    });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!bookingData.roomIds.length) errors.roomIds = "At least one room must be selected.";
    if (!bookingData.checkInDate) errors.checkInDate = "Check-in date is required.";
    if (!bookingData.checkOutDate) errors.checkOutDate = "Check-out date is required.";
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      if (checkOut <= checkIn) errors.checkOutDate = "Check-out must be after check-in.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) return setValidationErrors(errors);

    setIsSubmitting(true);
    try {
      await createBooking(bookingData);
      refreshNotifications();
      setModalMessage("Booking created successfully!");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return {
    bookingData,
    setBookingData,
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
  };
};

export default useBookingLogic;