import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi } from "../services/Booking";
import { roomApi } from "../services/Hotel";
import { Booking } from "../types/Booking";
import { Room } from "../types/Room";

type BookingSearchResult = {
  hotelId: number;
  roomId: number;
};

const mapRoomResponse = (room: any): Room => ({
  room_type: room.room_type || room.roomType || "Unknown",
  id: { hotelId: room.hotelId ?? room.id?.hotelId, roomId: room.roomId ?? room.id?.roomId },
  pricePerNight: room.pricePerNight ?? room.price,
  maxOccupancy: room.maxOccupancy ?? room.capacity ?? 2,
  status: room.status ?? "AVAILABLE",
});

const getBookedRoomIdSet = (bookings: BookingSearchResult[], hotelId: number): Set<number> => {
  const bookedRoomIds = new Set<number>();
  for (const booking of bookings) {
    if (booking.hotelId === hotelId) {
      bookedRoomIds.add(booking.roomId);
    }
  }
  return bookedRoomIds;
};

const getStayNights = (checkInDate: string, checkOutDate: string): number => {
  return Math.max(
    1,
    (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  );
};

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
  const showLoginPrompt = !userId;
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const roomPriceById = useMemo(() => {
    const prices = new Map<number, number>();
    for (const room of availableRooms) {
      prices.set(room.id.roomId, room.pricePerNight);
    }
    return prices;
  }, [availableRooms]);

  const roomTypeById = useMemo(() => {
    const types = new Map<number, string>();
    for (const room of availableRooms) {
      types.set(room.id.roomId, room.room_type);
    }
    return types;
  }, [availableRooms]);

  const roomIdsByType = useMemo(() => {
    const idsByType = new Map<string, number[]>();
    for (const room of availableRooms) {
      const existingIds = idsByType.get(room.room_type);
      if (existingIds) {
        existingIds.push(room.id.roomId);
      } else {
        idsByType.set(room.room_type, [room.id.roomId]);
      }
    }
    return idsByType;
  }, [availableRooms]);

  // Helper: calculate total amount based on roomIds and dates
  const calculateTotalAmount = useCallback(
    (roomIds: number[], checkInDate: string, checkOutDate: string) => {
      if (!checkInDate || !checkOutDate) return 0;

      const nights = getStayNights(checkInDate, checkOutDate);
      let total = 0;
      for (const roomId of roomIds) {
        const price = roomPriceById.get(roomId);
        if (price !== undefined) {
          total += price * nights;
        }
      }
      return total;
    },
    [roomPriceById]
  );

  // Fetch hotel rooms
  useEffect(() => {
    if (!hotelId) return;

    const fetchRooms = async () => {
      try {
        const roomsData = await roomApi.getHotelRooms(hotelId);
        const mappedRooms: Room[] = roomsData.map(mapRoomResponse);
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
        const bookings: BookingSearchResult[] = await bookingApi.searchBookingsByDate(
          checkInDate,
          checkOutDate
        );
        const bookedRoomIds = getBookedRoomIdSet(bookings, hotelId);
        const available = allRooms.filter((room) => !bookedRoomIds.has(room.id.roomId));
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
      const remainingRoomIds: number[] = [];
      for (const roomId of prev.roomIds) {
        if (roomTypeById.get(roomId) !== roomType) {
          remainingRoomIds.push(roomId);
        }
      }

      const roomIdsForType = roomIdsByType.get(roomType) ?? [];
      const selectedIds = roomIdsForType.slice(0, selectedCount);

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
