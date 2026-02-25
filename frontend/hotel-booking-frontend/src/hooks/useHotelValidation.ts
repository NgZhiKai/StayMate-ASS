import { RoomRequestDTO } from '../types/Room';

export interface HotelFormValues {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomRequestDTO[];
}

export interface ValidationResult {
  [key: string]: string;
}

export const useHotelValidation = () => {
  const validateHotel = (values: HotelFormValues, hotelId?: number): ValidationResult => {
    const errors: ValidationResult = {};

    if (!values.name.trim()) errors.name = 'Hotel name is required.';
    if (!values.address.trim()) errors.address = 'Hotel address is required.';
    if (!values.checkIn) errors.checkIn = 'Check-in time is required.';
    if (!values.checkOut) errors.checkOut = 'Check-out time is required.';

    const validRooms = values.rooms.filter(r => r.roomType?.trim());
    const roomSet = new Set<string>();
    validRooms.forEach((r, idx) => {
      const key = `room_${idx}`;
      if (!r.roomType) errors[`${key}_roomType`] = 'Room type required';
      if (roomSet.has(r.roomType.toUpperCase())) errors[`${key}_duplicate`] = 'Duplicate room type';
      else roomSet.add(r.roomType.toUpperCase());
      if (r.pricePerNight < 0) errors[`${key}_price`] = 'Price must be >= 0';
      if (r.maxOccupancy < 1) errors[`${key}_occupancy`] = 'Occupancy must be >= 1';
      if (r.quantity < 0) errors[`${key}_quantity`] = 'Quantity cannot be negative';
    });

    if (!hotelId && validRooms.every(r => r.quantity === 0)) errors.rooms = 'At least one room must have quantity > 0';

    return errors;
  };

  return { validateHotel };
};