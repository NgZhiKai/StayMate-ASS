import { FaStar } from "react-icons/fa";

export const formatToAMPM = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${period}`;
};

export const getPricingRange = (rooms: { pricePerNight: number }[] | undefined) => {
  if (!rooms?.length) return "$0 - $0";
  const prices = rooms.map(r => r.pricePerNight);
  return `$${Math.min(...prices)} - $${Math.max(...prices)}`;
};

export const renderStars = (rating: number) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map(i => (
      <FaStar
        key={i}
        className={`text-xl mr-1 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);