import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../../components/Booking/BookingCard";
import MessageModal from "../../components/Modal/MessageModal";
import {
  cancelBooking,
  fetchBookingsForUser,
} from "../../services/Booking/bookingApi";
import { fetchHotelById } from "../../services/Hotel/hotelApi";
import { DetailedBooking } from "../../types/Booking";

type HotelDetails = {
  name: string;
  checkIn: string;
  checkOut: string;
};

const BOOKINGS_PER_PAGE = 6;

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [hotelDetails, setHotelDetails] = useState<Record<number, HotelDetails>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const navigate = useNavigate();

  // ------------------- Helpers -------------------

  const showModal = (message: string, type: "success" | "error") =>
    setModal({ isOpen: true, message, type });

  const fetchHotelInfo = useCallback(async (hotelIds: number[]) => {
    const details: Record<number, HotelDetails> = {};
    await Promise.all(
      hotelIds.map(async (id) => {
        try {
          const hotel = await fetchHotelById(id);
          details[id] = {
            name: hotel.name,
            checkIn: hotel.checkIn,
            checkOut: hotel.checkOut,
          };
        } catch (err) {
          console.error(`Failed to fetch hotel ${id}`, err);
        }
      })
    );
    setHotelDetails(details);
  }, []);

  // ------------------- Fetch Bookings -------------------

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return console.error("User ID not found.");

      try {
        setLoading(true);
        const data = await fetchBookingsForUser(Number(userId));
        const bookingsArray = Array.isArray(data) ? data : [];
        setBookings(bookingsArray);

        // Fetch hotel details in parallel for all unique hotels
        const uniqueHotelIds = [...new Set(bookingsArray.map((b) => b.hotelId))];
        await fetchHotelInfo(uniqueHotelIds);
      } catch (err) {
        console.error("Error fetching bookings or hotels:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchHotelInfo]);

  // ------------------- Pagination -------------------

  const indexOfLast = currentPage * BOOKINGS_PER_PAGE;
  const indexOfFirst = indexOfLast - BOOKINGS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bookings.length / BOOKINGS_PER_PAGE);

  const goToPage = (page: number) => setCurrentPage(page);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // ------------------- Actions -------------------

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const result = await cancelBooking(bookingId);

      if ((result as any).error) {
        showModal((result as any).error, "error");
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
      showModal(`Booking #${bookingId} has been canceled.`, "success");
    } catch {
      showModal("An unexpected error occurred.", "error");
    }
  };

  const handleMakePayment = (bookingId: number) => {
    navigate("/payment", { state: { bookingId } });
  };

  // ------------------- Render -------------------

  return (
    <div className="bg-gray-900 min-h-full py-8 px-4 sm:px-6 lg:px-12">
      <h2 className="text-gray-100 text-3xl font-semibold text-center mb-8">
        Your Bookings
      </h2>

      {loading && <p className="text-center text-gray-500">Loading bookings...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0 && !loading ? (
          <p className="text-gray-500 text-center col-span-full">
            You have no bookings.
          </p>
        ) : (
          currentBookings.map((b) => (
            <BookingCard
              key={b.bookingId}
              booking={b}
              hotelName={hotelDetails[b.hotelId]?.name ?? "Loading..."}
              hotelCheckIn={hotelDetails[b.hotelId]?.checkIn ?? "N/A"}
              hotelCheckOut={hotelDetails[b.hotelId]?.checkOut ?? "N/A"}
              onCancelBooking={handleCancelBooking}
              onMakePayment={handleMakePayment}
            />
          ))
        )}
      </div>

      {bookings.length > BOOKINGS_PER_PAGE && (
        <div className="flex justify-center mt-4 items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-800 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200"
            }`}
          >
            &gt;
          </button>
        </div>
      )}

      <MessageModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default BookingPage;