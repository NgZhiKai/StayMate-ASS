// src/services/bookmarkService.ts

import axios from "axios";
import { userApiClient } from "./userApiClient";

const BOOKMARK_BASE = "/bookmarks";

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data ||
      "Something went wrong"
    );
  }
  throw new Error("Unexpected error occurred");
};

/**
 * Get all bookmarked hotel IDs for a user.
 */
export const getBookmarkedHotelIds = async (
  userId: number
): Promise<number[]> => {
  try {
    const response = await userApiClient.get<number[]>(
      `${BOOKMARK_BASE}/${userId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Add a bookmark.
 */
export const addBookmark = async (
  userId: number,
  hotelId: number
): Promise<void> => {
  try {
    await userApiClient.post(`${BOOKMARK_BASE}`, {
      userId,
      hotelIds: [hotelId], // backend expects array
    });
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Remove a bookmark.
 */
export const removeBookmark = async (
  userId: number,
  hotelId: number
): Promise<void> => {
  await userApiClient.delete(
    `${BOOKMARK_BASE}/${userId}/${hotelId}`
  );
};