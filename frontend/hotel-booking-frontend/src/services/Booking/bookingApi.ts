import { Booking, DetailedBooking } from "../../types/Booking";
import { bookingApiClient } from "./bookingApiClient";

const BOOKING_BASE = "/bookings";

/**
 * Create a booking
 */
export const createBooking = async (
  bookingData: Booking
): Promise<{ message: string; bookings: DetailedBooking[] }> => {
  const response = await bookingApiClient.post(BOOKING_BASE, bookingData);
  if (!response.data?.message) {
    throw new Error(response.data?.error || "Failed to create booking");
  }

  return response.data;
};

/**
 * Fetch all bookings
 */
export const fetchBookings = async (): Promise<DetailedBooking[]> => {
  const response = await bookingApiClient.get(BOOKING_BASE);
  return response.data?.data ?? [];
};

/**
 * Fetch booking by ID
 */
export const fetchBookingById = async (id: number): Promise<DetailedBooking> => {
  const response = await bookingApiClient.get(`${BOOKING_BASE}/${id}`);
  const data = response.data?.data;
  if (!data) throw new Error("Booking not found");
  return data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (id: number): Promise<{ message: string; bookingId: number; status: string }> => {
  const response = await bookingApiClient.delete(`${BOOKING_BASE}/${id}`);
  if (!response.data?.message) throw new Error("Failed to cancel booking");
  return response.data;
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: number,
  status: string
): Promise<{ message: string; bookingId: number; status: string }> => {
  const response = await bookingApiClient.post(`${BOOKING_BASE}/${bookingId}/status`, null, {
    params: { status },
  });

  if (!response.data?.message) throw new Error("Failed to update booking status");
  return response.data;
};

/**
 * Fetch bookings for a hotel
 */
export const fetchBookingsForHotel = async (hotelId: number): Promise<DetailedBooking[]> => {
  const response = await bookingApiClient.get(`${BOOKING_BASE}/hotel/${hotelId}`);
  return response.data?.data ?? [];
};

/**
 * Fetch bookings for a user
 */
export const fetchBookingsForUser = async (userId: number): Promise<DetailedBooking[]> => {
  const response = await bookingApiClient.get(`${BOOKING_BASE}/user/${userId}`);
  return response.data?.data ?? [];
};

/**
 * Search bookings by date range
 */
export const searchBookingsByDate = async (
  startDate: string,
  endDate: string
): Promise<DetailedBooking[]> => {
  const response = await bookingApiClient.get(`${BOOKING_BASE}/search/date`, {
    params: { startDate, endDate },
  });
  return response.data?.data ?? [];
};

/**
 * Check room availability
 */
export const checkRoomAvailability = async (
  hotelId: number,
  roomId: number,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean }> => {
  const response = await bookingApiClient.get(`${BOOKING_BASE}/availability`, {
    params: { hotelId, roomId, checkIn, checkOut },
  });
  return response.data;
};