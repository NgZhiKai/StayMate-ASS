// src/services/Hotel/hotelApi.ts
import { Destination, HotelData } from "../../types/Hotels";
import { hotelApiClient } from "./hotelApiClient";
import { handleApiError } from "../../utils/handleApiError";

const HOTEL_BASE = "/hotels";

const hotelApi = {
  /**
   * Create hotel (with rooms + image upload)
   */
  createHotel: async (formData: FormData): Promise<{ message: string }> => {
    try {
      const response = await hotelApiClient.post(HOTEL_BASE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.message !== "Hotel created successfully") {
        throw new Error("Failed to create hotel");
      }

      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch all hotels
   */
  fetchHotels: async (): Promise<HotelData[]> => {
    try {
      const response = await hotelApiClient.get(HOTEL_BASE);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch hotel by ID
   */
  fetchHotelById: async (id: number): Promise<HotelData> => {
    try {
      const response = await hotelApiClient.get(`${HOTEL_BASE}/${id}`);
      const data = response.data?.data;
      if (!data) throw new Error("Hotel not found");
      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Update hotel
   */
  updateHotel: async (id: number, formData: FormData): Promise<{ message: string }> => {
    try {
      const response = await hotelApiClient.put(`${HOTEL_BASE}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.message !== "Hotel updated successfully") {
        throw new Error("Failed to update hotel");
      }

      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Delete hotel
   */
  deleteHotel: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await hotelApiClient.delete(`${HOTEL_BASE}/${id}`);
      return { message: response.data?.message ?? "Hotel deleted successfully" };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Search hotels by name
   */
  searchHotelsByName: async (name: string): Promise<HotelData[]> => {
    try {
      const response = await hotelApiClient.get(`${HOTEL_BASE}/search`, {
        params: { name },
      });
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get nearby hotels
   */
  getHotelsNearby: async (latitude: number, longitude: number): Promise<HotelData[]> => {
    try {
      const response = await hotelApiClient.get(`${HOTEL_BASE}/nearby`, {
        params: { latitude, longitude },
      });
      return response.data?.data ?? response.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch multiple hotels by IDs
   */
  fetchHotelsByIds: async (hotelIds: number[]): Promise<HotelData[]> => {
    try {
      const response = await hotelApiClient.post(`${HOTEL_BASE}/bulk`, { hotelIds });
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Search hotels by city and country
   */
  searchHotelsByLocation: async (city?: string, country?: string): Promise<HotelData[]> => {
    try {
      const response = await hotelApiClient.get(`${HOTEL_BASE}/search/location`, {
        params: { city: city ?? "", country: country ?? "" },
      });
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get popular destinations (grouped by city/country + hotel count)
   */
  fetchHotelDestinations: async (): Promise<Destination[]> => {
    try {
      const response = await hotelApiClient.get(`${HOTEL_BASE}/destinations`);
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default hotelApi;