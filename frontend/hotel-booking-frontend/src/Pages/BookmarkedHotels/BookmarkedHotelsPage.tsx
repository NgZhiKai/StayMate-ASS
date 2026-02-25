import React from "react";
import { BookmarkedHotelsEmpty, BookmarkedHotelsError, BookmarkedHotelsList } from "../../components/BookmarkedHotels";
import { HeroSection, LoadingSpinner } from "../../components/Misc";
import { useBookmarkedHotels } from "../../hooks/useBookmarkedHotels";

const BookmarkedHotelsPage: React.FC = () => {
  const userId = Number(sessionStorage.getItem("userId"));
  const { hotels, loading, error } = useBookmarkedHotels(userId);

  return (
    <div className="select-none">
      <HeroSection
        title="Your favorite stays"
        highlight="favorite stays"
        description="All your bookmarked hotels and cozy escapes in one place."
        align="left"
      />
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