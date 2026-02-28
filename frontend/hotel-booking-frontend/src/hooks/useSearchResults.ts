import { useEffect, useState } from "react";
import { bookingApi } from "../services/Booking";
import { hotelApi } from "../services/Hotel";
import { Destination, HotelData } from "../types/Hotels";

type BookingRoomRef = {
  hotelId: number;
  roomId: number;
};

const buildBookedRoomSet = (bookings: BookingRoomRef[]): Set<string> => {
  return new Set(bookings.map((booking) => `${booking.hotelId}-${booking.roomId}`));
};

const filterHotelsByAvailability = (allHotels: HotelData[], bookedSet: Set<string>): HotelData[] => {
  const hotelsWithAvailableRooms = allHotels.map((hotel) => {
    const availableRooms = hotel.rooms.filter(
      (room) => !bookedSet.has(`${hotel.id}-${room.id.roomId}`)
    );
    return { ...hotel, rooms: availableRooms };
  });

  return hotelsWithAvailableRooms.filter((hotel) => hotel.rooms.length > 0);
};

const fetchHotelsForSearch = async (
  city: string,
  country: string,
  checkIn?: string,
  checkOut?: string
): Promise<HotelData[]> => {
  const allHotels = await hotelApi.searchHotelsByLocation(city, country);
  if (!checkIn || !checkOut) return allHotels;

  const bookings: BookingRoomRef[] = await bookingApi.searchBookingsByDate(checkIn, checkOut);
  const bookedSet = buildBookedRoomSet(bookings);
  return filterHotelsByAvailability(allHotels, bookedSet);
};

export const useSearchResults = (
  city: string,
  country: string,
  checkIn?: string,
  checkOut?: string
) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const hotels = await fetchHotelsForSearch(city, country, checkIn, checkOut);
        setHotels(hotels);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [city, country, checkIn, checkOut]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await hotelApi.fetchHotelDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load popular destinations", err);
      }
    };
    loadDestinations();
  }, []);

  return { hotels, loading, error, destinations, hoveredHotelId, setHoveredHotelId };
};
