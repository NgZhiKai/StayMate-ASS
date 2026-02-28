import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { bookingApi } from "../services/Booking";
import { BookingContextData } from "../types/Booking";

interface BookingContextType {
  bookings: BookingContextData[];
  updateBookingStatus: (id: number, status: BookingContextData["status"]) => void;
  refreshBookings: () => Promise<void>;
  userId?: number | null; // optional
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  userId?: number | null;
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ userId, children }) => {
  const [bookings, setBookings] = useState<BookingContextData[]>([]);

  const loadBookings = useCallback(async () => {
    const effectiveUserId = userId ?? Number(sessionStorage.getItem("userId"));
    if (!effectiveUserId) {
      setBookings([]);
      return;
    }

    try {
      const data = await bookingApi.fetchBookingsForUser(effectiveUserId);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  }, [userId]);

  const updateBookingStatus = useCallback((id: number, status: BookingContextData["status"]) => {
    setBookings(prev => prev.map(b => (b.bookingId === id ? { ...b, status } : b)));
  }, []);

  const refreshBookings = useCallback(async () => {
    await loadBookings();
  }, [loadBookings]);

  const contextValue = useMemo(
    () => ({ bookings, updateBookingStatus, refreshBookings, userId }),
    [bookings, updateBookingStatus, refreshBookings, userId]
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>;
};

export const useBookingContext = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookingContext must be used within BookingProvider");
  return context;
};
