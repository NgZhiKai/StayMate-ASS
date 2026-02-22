// hooks/useBookmark.ts
import { useEffect, useState } from "react";
import { addBookmark, removeBookmark, getBookmarkedHotelIds } from "../services/User/bookmarkApi";

export const useBookmark = (userId: number | null, hotelId: number | null) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [canBookmark, setCanBookmark] = useState(false); // whether user can actually bookmark

  useEffect(() => {
    if (!userId || !hotelId) {
      setIsBookmarked(false);
      setCanBookmark(false);
      return;
    }

    setCanBookmark(true);

    const loadBookmarks = async () => {
      try {
        const bookmarked = await getBookmarkedHotelIds(userId);
        if (Array.isArray(bookmarked)) {
          setIsBookmarked(bookmarked.includes(hotelId));
        }
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      }
    };

    loadBookmarks();
  }, [userId, hotelId]);

  const toggleBookmark = async () => {
    if (!canBookmark || !hotelId || !userId) return;

    try {
      if (isBookmarked) {
        await removeBookmark(userId, hotelId);
        setIsBookmarked(false);
      } else {
        await addBookmark(userId, hotelId);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  return { isBookmarked, canBookmark, toggleBookmark };
};