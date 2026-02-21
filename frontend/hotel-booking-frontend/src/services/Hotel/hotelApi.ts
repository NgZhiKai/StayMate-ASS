import { Destination, HotelData } from "../../types/Hotels";
import { hotelApiClient } from "./hotelApiClient";

const HOTEL_BASE = "/hotels";

/**
 * Create hotel (with rooms + image upload)
 */
export const createHotel = async (
  formData: FormData
): Promise<{ message: string }> => {
  const response = await hotelApiClient.post(
    HOTEL_BASE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data?.message !== "Hotel created successfully") {
    throw new Error("Failed to create hotel");
  }

  return response.data;
};

/**
 * Fetch all hotels
 */
export const fetchHotels = async (): Promise<HotelData[]> => {
  const response = await hotelApiClient.get(HOTEL_BASE);

  return response.data?.data ?? [];
};

/**
 * Fetch hotel by ID
 */
export const fetchHotelById = async (
  id: number
): Promise<HotelData> => {
  const response = await hotelApiClient.get(
    `${HOTEL_BASE}/${id}`
  );

  const data = response.data?.data;

  if (!data) {
    throw new Error("Hotel not found");
  }

  return data;
};

/**
 * Update hotel
 */
export const updateHotel = async (
  id: number,
  formData: FormData
): Promise<{ message: string }> => {
  const response = await hotelApiClient.put(
    `${HOTEL_BASE}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.data?.message !== "Hotel updated successfully") {
    throw new Error("Failed to update hotel");
  }

  return response.data;
};

/**
 * Delete hotel
 */
export const deleteHotel = async (
  id: number
): Promise<{ message: string }> => {
  const response = await hotelApiClient.delete(
    `${HOTEL_BASE}/${id}`
  );

  return response.data;
};

/**
 * Search hotels by name
 */
export const searchHotelsByName = async (
  name: string
): Promise<HotelData[]> => {
  const response = await hotelApiClient.get(
    `${HOTEL_BASE}/search`,
    { params: { name } }
  );

  return response.data?.data ?? [];
};

/**
 * Get nearby hotels
 */
export const getHotelsNearby = async (
  latitude: number,
  longitude: number
): Promise<HotelData[]> => {
  const response = await hotelApiClient.get(
    `${HOTEL_BASE}/nearby`,
    {
      params: { latitude, longitude },
    }
  );

  return response.data?.data ?? response.data ?? [];
};

/**
 * Fetch multiple hotels by IDs
 */
export const fetchHotelsByIds = async (
  hotelIds: number[]
): Promise<HotelData[]> => {
  const response = await hotelApiClient.post(
    `${HOTEL_BASE}/bulk`,
    { hotelIds }
  );

  return response.data?.data ?? [];
};

/**
 * Search hotels by city and country
 */
export const searchHotelsByLocation = async (
  city?: string,
  country?: string
): Promise<HotelData[]> => {
  const response = await hotelApiClient.get(
    `${HOTEL_BASE}/search/location`,
    {
      params: {
        city: city ?? "",
        country: country ?? "",
      },
    }
  );

  return response.data?.data ?? [];
};

/**
 * Get popular destinations (grouped by city/country + hotel count)
 */
export const fetchHotelDestinations = async (): Promise<Destination[]> => {
  const response = await hotelApiClient.get('/hotels/destinations');
  return response.data?.data ?? [];
};