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
  roomType: string;       // Type of room (e.g., "Single", "Double", etc.)
  pricePerNight: number;  // Price per night
  maxOccupancy: number;   // Max number of people allowed in the room
  quantity: number;       // Quantity of available rooms of this type
}


// src/types/Rooms.ts
export interface RoomData {
  id: number;           // Room ID
  roomId: number;       // Optional alternative ID if you use both
  hotelId: number;      // ID of the hotel this room belongs to
  roomType: string;     // e.g., "Single", "Double", "Suite"
  price: number;        // Room price per night
  capacity: number;     // Number of guests
  description?: string; // Optional room description
  imageUrl?: string;    // Optional image URL
}

export const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];
