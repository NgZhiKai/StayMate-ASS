import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "../services/Booking";
import { roomApi } from "../services/Hotel";
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";

export const useBookingLogic = (
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

  // Helper: calculate total amount based on roomIds and dates
  const calculateTotalAmount = useCallback(
    (roomIds: number[], checkInDate: string, checkOutDate: string) => {
      if (!checkInDate || !checkOutDate) return 0;

      const nights = Math.max(
        1,
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return roomIds.reduce((sum, id) => {
        const room = availableRooms.find((r) => r.id.roomId === id);
        return room ? sum + room.pricePerNight * nights : sum;
      }, 0);
    },
    [availableRooms]
  );

  // Fetch hotel rooms
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

  // Filter available rooms based on selected dates
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      const { checkInDate, checkOutDate } = bookingData;
      if (!checkInDate || !checkOutDate || allRooms.length === 0) return;

      try {
        const bookings = await bookingApi.searchBookingsByDate(checkInDate, checkOutDate);
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

  // Recalculate totalAmount whenever dates or room selection changes
  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      totalAmount: calculateTotalAmount(prev.roomIds, prev.checkInDate, prev.checkOutDate),
    }));
  }, [bookingData.checkInDate, bookingData.checkOutDate, bookingData.roomIds, calculateTotalAmount]);

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

      return { ...prev, roomIds: [...remainingRoomIds, ...selectedIds] };
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

  const submitBooking = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length) return setValidationErrors(errors);

    setIsSubmitting(true);
    try {
      await bookingApi.createBooking(bookingData);
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
    submitBooking,
    showModal,
    modalMessage,
    handleModalClose,
    showLoginPrompt,
  };
};