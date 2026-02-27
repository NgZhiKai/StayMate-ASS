// src/services/Booking/bookingApi.ts
import { Booking, DetailedBooking } from "../../types/Booking";
import { bookingApiClient } from "./bookingApiClient";
import { handleApiError } from "../../utils/handleApiError";

const BOOKING_BASE = "/bookings";

const bookingApi = {
  /**
   * Create a booking
   */
  createBooking: async (bookingData: Booking): Promise<{ message: string; bookings: DetailedBooking[] }> => {
    try {
      const response = await bookingApiClient.post(BOOKING_BASE, bookingData);

      if (!response.data?.message) {
        throw new Error(response.data?.error || "Failed to create booking");
      }

      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch all bookings
   */
  fetchBookings: async (): Promise<DetailedBooking[]> => {
    try {
      const response = await bookingApiClient.get(BOOKING_BASE);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch booking by ID
   */
  fetchBookingById: async (id: number): Promise<DetailedBooking> => {
    try {
      const response = await bookingApiClient.get(`${BOOKING_BASE}/${id}`);
      const data = response.data?.data;
      if (!data) throw new Error("Booking not found");
      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Update booking status
   */
  updateBookingStatus: async (bookingId: number, status: string): Promise<{ message: string; bookingId: number; status: string }> => {
    try {
      const response = await bookingApiClient.post(`${BOOKING_BASE}/${bookingId}/status`, null, {
        params: { status },
      });

      if (!response.data?.message) throw new Error("Failed to update booking status");
      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id: number): Promise<{ message: string; bookingId: number; status: string }> => {
    try {
      const response = await bookingApiClient.delete(`${BOOKING_BASE}/${id}`);
      if (!response.data?.message) throw new Error("Failed to cancel booking");
      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch bookings for a specific hotel
   */
  fetchBookingsForHotel: async (hotelId: number): Promise<DetailedBooking[]> => {
    try {
      const response = await bookingApiClient.get(`${BOOKING_BASE}/hotel/${hotelId}`);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch bookings for a specific user
   */
  fetchBookingsForUser: async (userId: number): Promise<DetailedBooking[]> => {
    try {
      const response = await bookingApiClient.get(`${BOOKING_BASE}/user/${userId}`);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Search bookings by date range
   */
  searchBookingsByDate: async (startDate: string, endDate: string): Promise<DetailedBooking[]> => {
    try {
      const response = await bookingApiClient.get(`${BOOKING_BASE}/search/date`, {
        params: { startDate, endDate },
      });
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Check room availability
   */
  checkRoomAvailability: async (hotelId: number, roomId: number, checkIn: string, checkOut: string): Promise<{ available: boolean }> => {
    try {
      const response = await bookingApiClient.get(`${BOOKING_BASE}/availability`, {
        params: { hotelId, roomId, checkIn, checkOut },
      });
      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default bookingApi;