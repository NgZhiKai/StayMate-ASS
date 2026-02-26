import { useCallback, useEffect, useState } from "react";
import { bookmarkApi } from "../services/User";

interface UseBookmarkReturn {
  isBookmarked: boolean;
  canBookmark: boolean;
  toggleBookmark: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useBookmark = (
  userId: number | null,
  hotelId: number | null
): UseBookmarkReturn => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [canBookmark, setCanBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !hotelId) {
      console.log(userId);
      console.log(hotelId);
      setIsBookmarked(false);
      setCanBookmark(false);
      setLoading(false);
      return;
    }

    setCanBookmark(true);
    setLoading(true);

    const loadBookmarks = async () => {
      try {
        const { hotelIds } = await bookmarkApi.getBookmarkedHotelIds(userId);
        setIsBookmarked(hotelIds.includes(hotelId));
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
        setError("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [userId, hotelId]);

  const toggleBookmark = useCallback(async () => {
    if (!canBookmark || !userId || !hotelId) return;

    try {
      if (isBookmarked) {
        await bookmarkApi.removeBookmark(userId, hotelId);
        setIsBookmarked(false);
      } else {
        await bookmarkApi.addBookmark(userId, [hotelId]);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark error:", err);
      setError("Failed to update bookmark");
    }
  }, [canBookmark, isBookmarked, userId, hotelId]);

  return { isBookmarked, canBookmark, toggleBookmark, loading, error };
};