import { hotelApiClient } from "../Hotel/hotelApiClient";
import { RoomData } from "../../types/Room";
import { handleApiError } from "../../utils/handleApiError";

const ROOM_BASE = "/rooms";

const roomApi = {
  /**
   * Fetch all rooms for a specific hotel
   */
  getHotelRooms: async (hotelId: number): Promise<RoomData[]> => {
    try {
      const response = await hotelApiClient.get(`${ROOM_BASE}/${hotelId}`);
      return response.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch available rooms for a hotel in a date range
   */
  getAvailableRooms: async (
    hotelId: number,
    checkInDate: string,
    checkOutDate: string
  ): Promise<RoomData[]> => {
    try {
      const response = await hotelApiClient.get(`${ROOM_BASE}/available-rooms`, {
        params: { hotelId, checkInDate, checkOutDate },
      });
      return response.data?.data ?? [];
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Fetch a specific room by hotelId and roomId
   */
  getRoomById: async (hotelId: number, roomId: number): Promise<RoomData> => {
    try {
      const response = await hotelApiClient.get(`${ROOM_BASE}/${hotelId}/${roomId}`);
      const data = response.data?.data;
      if (!data) throw new Error("Room not found");
      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default roomApi;