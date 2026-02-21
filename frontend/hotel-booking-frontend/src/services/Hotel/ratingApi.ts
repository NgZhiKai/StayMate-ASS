import { Review } from "../../types/Review";
import { hotelApiClient } from "./hotelApiClient";

const REVIEW_BASE = "/reviews";

/**
 * Fetch all reviews
 */
export const getAllReviews = async (): Promise<Review[]> => {
  const response = await hotelApiClient.get(REVIEW_BASE);
  return response.data?.data ?? [];
};

/**
 * Fetch a review by ID
 */
export const getReviewById = async (id: number): Promise<Review> => {
  const response = await hotelApiClient.get(`${REVIEW_BASE}/${id}`);
  const data = response.data?.data;
  if (!data) throw new Error("Review not found");
  return data;
};

/**
 * Create a new review
 */
export const createReview = async (review: Review): Promise<Review> => {
  const response = await hotelApiClient.post(REVIEW_BASE, review);
  return response.data?.data;
};

/**
 * Update an existing review
 */
export const updateReview = async (id: number, review: Review): Promise<Review> => {
  const response = await hotelApiClient.put(`${REVIEW_BASE}/${id}`, review);
  return response.data?.data;
};

/**
 * Delete a review by ID
 */
export const deleteReview = async (id: number): Promise<{ message: string }> => {
  const response = await hotelApiClient.delete(`${REVIEW_BASE}/${id}`);
  return response.data;
};

/**
 * Fetch reviews for a specific hotel
 */
export const getReviewsForHotel = async (hotelId: number): Promise<Review[]> => {
  const response = await hotelApiClient.get(`${REVIEW_BASE}/hotel/${hotelId}`);
  return response.data?.data ?? [];
};