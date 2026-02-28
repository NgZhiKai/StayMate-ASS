import { toApiError } from "../_core/apiError";
import { userApiClient } from "./userApiClient";

const BOOKMARK_BASE = "/bookmarks";

const bookmarkApi = {
  /**
   * Get all bookmarked hotel IDs for a user.
   */
  getBookmarkedHotelIds: async (userId: number): Promise<{ hotelIds: number[] }> => {
    try {
      const response = await userApiClient.get(`${BOOKMARK_BASE}/${userId}`);
      const hotelIds = response.data ?? [];
      return { hotelIds };
    } catch (error) {
      throw toApiError(error);
    }
  },

  /**
   * Add one or more bookmarks for a user.
   */
  addBookmark: async (userId: number, hotelIds: number[]): Promise<{ message: string }> => {
    try {
      const response = await userApiClient.post(BOOKMARK_BASE, { userId, hotelIds });
      return { message: response.data?.message ?? "Bookmark added successfully" };
    } catch (error) {
      throw toApiError(error);
    }
  },

  /**
   * Remove a bookmark for a user.
   */
  removeBookmark: async (userId: number, hotelId: number): Promise<{ message: string }> => {
    try {
      const response = await userApiClient.delete(`${BOOKMARK_BASE}/${userId}/${hotelId}`);
      return { message: response.data?.message ?? "Bookmark removed successfully" };
    } catch (error) {
      throw toApiError(error);
    }
  },
};

export default bookmarkApi;
