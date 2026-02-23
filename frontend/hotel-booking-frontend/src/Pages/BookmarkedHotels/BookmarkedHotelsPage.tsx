import React from "react";
import { useBookmarkedHotels } from "../../hooks/useBookmarkedHotels";
import { BookmarkedHotelsList, BookmarkedHotelsEmpty, BookmarkedHotelsError } from "../../components/BookmarkedHotels";
import { LoadingSpinner } from "../../components/BookmarkedHotels/LoadingSpinner";

const BookmarkedHotelsPage: React.FC = () => {
  const userId = Number(sessionStorage.getItem("userId"));
  const { hotels, loading, error } = useBookmarkedHotels(userId);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Your Bookmarked Hotels
      </h1>

      {loading && <LoadingSpinner />}
      {error && <BookmarkedHotelsError message={error} />}
      {!loading && !error && hotels.length === 0 && <BookmarkedHotelsEmpty />}
      {!loading && !error && hotels.length > 0 && <BookmarkedHotelsList hotels={hotels} />}
    </div>
  );
};

export default BookmarkedHotelsPage;