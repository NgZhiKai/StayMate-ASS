import React from "react";
import { useBookmarkedHotels } from "../../hooks/useBookmarkedHotels";
import { HeroSection, BookmarkedHotelsList, BookmarkedHotelsEmpty, BookmarkedHotelsError } from "../../components/BookmarkedHotels";
import { LoadingSpinner } from "../../components/Misc";

const BookmarkedHotelsPage: React.FC = () => {
  const userId = Number(sessionStorage.getItem("userId"));
  const { hotels, loading, error } = useBookmarkedHotels(userId);

  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && <LoadingSpinner />}
        {error && <BookmarkedHotelsError message={error} />}
        {!loading && !error && hotels.length === 0 && <BookmarkedHotelsEmpty />}
        {!loading && !error && hotels.length > 0 && <BookmarkedHotelsList hotels={hotels} />}
      </div>
    </div>
  );
};

export default BookmarkedHotelsPage;