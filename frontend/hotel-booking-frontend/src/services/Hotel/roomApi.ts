// src/services/Room/roomApi.ts
import { hotelApiClient } from "../Hotel/hotelApiClient"; // Using the same axios client
import { RoomData } from "../../types/Room"; // Define your RoomData type if needed

const ROOM_BASE = "/rooms";

/**
 * Fetch all rooms for a specific hotel
 */
export const getHotelRooms = async (hotelId: number): Promise<RoomData[]> => {
  const response = await hotelApiClient.get(`${ROOM_BASE}/${hotelId}`);
  return response.data ?? [];
};

/**
 * Fetch available rooms for a hotel in a date range
 */
export const getAvailableRooms = async (
  hotelId: number,
  checkInDate: string,
  checkOutDate: string
): Promise<RoomData[]> => {
  const response = await hotelApiClient.get(`${ROOM_BASE}/available-rooms`, {
    params: { hotelId, checkInDate, checkOutDate },
  });

  return response.data?.data ?? [];
};

/**
 * Fetch room by ID
 */
export const getRoomById = async (
  hotelId: number,
  roomId: number
): Promise<RoomData> => {
  const response = await hotelApiClient.get(`${ROOM_BASE}/${hotelId}/${roomId}`);
  const data = response.data?.data;

  if (!data) {
    throw new Error("Room not found");
  }

  return data;
};