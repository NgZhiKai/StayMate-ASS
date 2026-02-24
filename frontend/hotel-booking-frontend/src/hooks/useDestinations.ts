import { useEffect, useState } from "react";
import { hotelApi } from "../services/Hotel";
import { Destination } from "../types/Hotels";

export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await hotelApi.fetchHotelDestinations();
        setDestinations(data || []);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations, loading };
};