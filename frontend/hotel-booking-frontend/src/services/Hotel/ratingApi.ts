import { Review } from "../../types/Review";
import { hotelApiClient } from "./hotelApiClient";
import { handleApiError } from "../../utils/handleApiError";

const REVIEW_BASE = "/reviews";

const ratingApi = {
  getAllReviews: async (): Promise<Review[]> => {
    try {
      const response = await hotelApiClient.get(REVIEW_BASE);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  getReviewById: async (id: number): Promise<Review> => {
    try {
      const response = await hotelApiClient.get(`${REVIEW_BASE}/${id}`);
      const data = response.data?.data;
      if (!data) throw new Error("Review not found");
      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  createReview: async (review: Review): Promise<Review> => {
    try {
      const response = await hotelApiClient.post(REVIEW_BASE, review);
      return response.data?.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  updateReview: async (id: number, review: Review): Promise<Review> => {
    try {
      const response = await hotelApiClient.put(`${REVIEW_BASE}/${id}`, review);
      return response.data?.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  deleteReview: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await hotelApiClient.delete(`${REVIEW_BASE}/${id}`);
      return { message: response.data?.message ?? "Review deleted successfully" };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  getReviewsForHotel: async (hotelId: number): Promise<Review[]> => {
    try {
      const response = await hotelApiClient.get(`${REVIEW_BASE}/hotel/${hotelId}`);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default ratingApi;