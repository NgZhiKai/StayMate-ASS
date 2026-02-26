import { useEffect, useState } from "react";
import { bookingApi } from "../services/Booking";
import { hotelApi } from "../services/Hotel";
import { Destination, HotelData } from "../types/Hotels";

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

        // 1. Fetch all hotels
        let hotels = await hotelApi.searchHotelsByLocation(city, country);

        // 2. If dates are selected, fetch bookings
        if (checkIn && checkOut) {
          const bookings = await bookingApi.searchBookingsByDate(checkIn, checkOut);

          // 3. Create a Set of "hotelId-roomId" strings for booked rooms
          const bookedSet = new Set(bookings.map(b => `${b.hotelId}-${b.roomId}`));

          // 4. Filter rooms in each hotel efficiently
          hotels = hotels.map(hotel => {
            const availableRooms = hotel.rooms.filter(
              room => !bookedSet.has(`${hotel.id}-${room.id.roomId}`)
            );
            return { ...hotel, rooms: availableRooms };
          });

          // 5. Remove hotels with no available rooms
          hotels = hotels.filter(hotel => hotel.rooms.length > 0);
        }

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