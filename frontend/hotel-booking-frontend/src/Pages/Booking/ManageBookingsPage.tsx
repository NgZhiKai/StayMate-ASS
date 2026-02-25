import React, { useState } from "react";
import { HeroSection } from "../../components/Misc";
import { BookingAdminCard } from "../../components/Booking";
import { Pagination } from "../../components/Pagination";
import { useBookings } from "../../hooks/useBookings";

const ITEMS_PER_PAGE = 8;

const ManageBookingsPage: React.FC = () => {
  const { bookings, error, cancelBooking } = useBookings();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const indexOfLastBooking = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBooking = indexOfLastBooking - ITEMS_PER_PAGE;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const generatePages = (): (number | string)[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 min-h-full text-gray-900">
      <HeroSection
        title="Manage All Bookings"
        highlight="Bookings"
        description="View all bookings made on your platform and manage them efficiently."
        align="left"
      />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentBookings.map((booking) => (
              <BookingAdminCard key={booking.id} booking={booking} onCancel={cancelBooking} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pages={generatePages()}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default ManageBookingsPage;