import { Room } from './Room';

export interface Hotel {
    id: number;
    name: string;
    address: string;
    rating: number;
    pricePerNight: number;
    image: string;
  }
  
export interface SearchFilters {
    location: string;
    priceRange: [number, number];
    rating: number;
  }

  export interface HotelData {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string;
    contact: string;
    averageRating: number;
    image?: string;
    rooms: Room[];
    checkIn: string;
    checkOut: string;
    country: string;
    city: string;
}

export interface Destination {
  city: string;
  country: string;
  count: number;
  imageUrl: string;
}