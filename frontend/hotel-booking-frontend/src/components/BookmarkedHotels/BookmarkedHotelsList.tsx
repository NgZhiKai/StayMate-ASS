import React from "react";
import { Link } from "react-router-dom";
import { HotelCard } from "../Hotel";
import { HotelData } from "../../types/Hotels";

interface Props {
  hotels: HotelData[];
}

export const BookmarkedHotelsList: React.FC<Props> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hotels.map((hotel) => (
        <Link
          key={hotel.id}
          to={`/hotel/${hotel.id}`}
          className="text-left"
          aria-label={`Open ${hotel.name} details`}
        >
          <HotelCard hotel={hotel} />
        </Link>
      ))}
    </div>
  );
};

export default BookmarkedHotelsList;
