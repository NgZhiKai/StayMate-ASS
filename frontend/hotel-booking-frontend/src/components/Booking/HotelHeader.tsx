import React from "react";

interface Props {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
}

const HotelHeader: React.FC<Props> = ({ hotelName, checkInDate, checkOutDate }) => (
  <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white shadow-lg">
    <h1 className="text-3xl font-bold">{hotelName}</h1>
    <p className="mt-1 text-sm opacity-80">
      Check-in: {new Date(checkInDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} →{" "}
      Check-out: {new Date(checkOutDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
    </p>
  </div>
);

export default HotelHeader;