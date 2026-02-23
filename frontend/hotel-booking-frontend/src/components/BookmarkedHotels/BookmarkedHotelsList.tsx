import React from "react";
import HotelCard from "../Hotel/HotelCard";
import { HotelData } from "../../types/Hotels";

interface Props {
  hotels: HotelData[];
}

export const BookmarkedHotelsList: React.FC<Props> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default BookmarkedHotelsList;