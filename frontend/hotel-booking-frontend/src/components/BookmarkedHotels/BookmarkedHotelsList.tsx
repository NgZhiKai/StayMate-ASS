import React from "react";
import { useNavigate } from "react-router-dom";
import HotelCard from "../Hotel/HotelCard";
import { HotelData } from "../../types/Hotels";

interface Props {
  hotels: HotelData[];
}

export const BookmarkedHotelsList: React.FC<Props> = ({ hotels }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel.id} onClick={() => navigate(`/hotel/${hotel.id}`)}>
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
};

export default BookmarkedHotelsList;