export interface Room {
  room_type: string;
  id: {
    hotelId: number;
    roomId: number;
  };
  pricePerNight: number;
  maxOccupancy: number;
  status: string;
}

export interface RoomRequestDTO {
  roomType: string;
  pricePerNight: number;
  maxOccupancy: number;
  quantity: number;
}


// src/types/Rooms.ts
export interface RoomData {
  id: number;
  roomId: number;
  hotelId: number;
  roomType: string;
  price: number;  
  capacity: number;
  description?: string;
  imageUrl?: string;
}

export const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];
