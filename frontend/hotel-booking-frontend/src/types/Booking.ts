export interface Booking {
  userId: number;
  hotelId: number;
  roomIds: number[];
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
}

export interface DetailedBooking {
    id: number;
    bookingId: number;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    status: 'CANCELLED' | 'CONFIRMED' | 'PENDING'; 
    totalAmount: number; 
    hotelId: number; 
    roomId: number; 
    userId: number;  
    userFirstName: string;
    userLastName: string;
    hotelName: string;
    roomType: string;
    hotelCheckInTime: string;
    hotelCheckOutTime: string;
}

export interface BookingCardData {
  bookingId: number;
  roomType: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingContextData {
  bookingId: number;
  hotelId: number;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}