import React, { useEffect, useState, useCallback } from "react";
import { bookingApi } from "../services/Booking";
import { hotelApi } from "../services/Hotel";
import { userApi } from "../services/User";
import { DetailedBooking } from "../types/Booking";

const ITEMS_PER_PAGE = 8;

const ManageBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  // ------------------- Helpers -------------------

  const fetchBookingDetails = useCallback(async () => {
    try {
      const result: DetailedBooking[] = await bookingApi.fetchBookings(); // API returns array of DetailedBooking

      // Fetch user & hotel info in parallel for each booking
      const detailedBookings = await Promise.all(
        result.map(async (booking) => {
          const [userInfo, hotelInfo] = await Promise.all([
            userApi.getUserInfo(String(booking.userId)),
            hotelApi.fetchHotelById(booking.hotelId),
          ]);

          return {
            ...booking,
            userFirstName: userInfo.user.firstName,
            userLastName: userInfo.user.lastName,
            hotelName: hotelInfo.name,
            hotelCheckInTime: hotelInfo.checkIn || "N/A",
            hotelCheckOutTime: hotelInfo.checkOut || "N/A",
          };
        })
      );

      setBookings(detailedBookings);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
    }
  }, []);

  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // ------------------- Pagination -------------------

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const indexOfLastBooking = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBooking = indexOfLastBooking - ITEMS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const goToPage = (page: number) => setCurrentPage(page);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // ------------------- Actions -------------------

  const handleCancel = async (bookingId: number) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking");
    }
  };

  // ------------------- Render -------------------

  return (
    <div className="p-6 bg-gray-900 text-white min-h-full relative">
      <h1 className="text-2xl mb-4">Manage Bookings</h1>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className={`flex flex-col p-3 rounded-lg ${
                booking.status === "CANCELLED" ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              <h2 className="text-lg font-semibold">Booking ID: {booking.bookingId}</h2>
              <p className="text-sm">User: {booking.userFirstName} {booking.userLastName}</p>
              <p className="text-sm">Hotel: {booking.hotelName}</p>
              <p className="text-sm">
                Check-in: {new Date(booking.checkInDate).toLocaleDateString()} at {booking.hotelCheckInTime?.slice(0,5)}
              </p>
              <p className="text-sm">
                Check-out: {new Date(booking.checkOutDate).toLocaleDateString()} at {booking.hotelCheckOutTime?.slice(0,5)}
              </p>
              <p className="text-sm">
                <span className={`font-semibold py-1 px-3 rounded-full inline-block ${
                  booking.status === "CONFIRMED"
                    ? "bg-green-100 text-green-600"
                    : booking.status === "CANCELLED"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {booking.status}
                </span>
              </p>

              {booking.status !== "CANCELLED" && (
                <button
                  onClick={() => handleCancel(booking.bookingId)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded transition-all duration-300 transform hover:bg-red-400 hover:scale-105"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ------------------- Pagination ------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;