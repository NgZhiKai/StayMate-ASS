import React from "react";
import { HeroSection, LoadingSpinner } from "../../components/Misc";
import { Pagination } from "../../components/Pagination";
import {
  BookmarkedHotelsEmpty,
  BookmarkedHotelsError,
  BookmarkedHotelsList,
} from "../../components/BookmarkedHotels";
import { useBookmarkedHotels, useSmartPagination } from "../../hooks";

const ITEMS_PER_PAGE = 8;

const BookmarkedHotelsPage: React.FC = () => {
  const userId = Number(sessionStorage.getItem("userId"));
  const { hotels, loading, error } = useBookmarkedHotels(userId);

  const { currentPage, totalPages, paginatedData, goToPage, pages } =
    useSmartPagination({
      data: hotels,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <BookmarkedHotelsError message={error} />
      </div>
    );

  const hasData = paginatedData.length > 0;

  return (
    <div className="select-none min-h-full bg-gradient-to-tr from-purple-50 via-pink-50 to-white">
      <HeroSection
        title="Your favorite stays"
        highlight="favorite stays"
        description="All your bookmarked hotels and cozy escapes in one place."
        align="left"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {hasData ? (
          <>
            <div className="grid gap-6">
              <BookmarkedHotelsList hotels={paginatedData} />
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pages={pages}
                goToPage={goToPage}
              />
            </div>
          </>
        ) : (
          <BookmarkedHotelsEmpty />
        )}
      </div>
    </div>
  );
};

export default BookmarkedHotelsPage;
