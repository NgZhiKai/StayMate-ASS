import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBookingById } from "../services/Booking/bookingApi";
import { hotelApi } from "../services/Hotel";
import { paymentApi } from "../services/Payment";

export const useBookingPayment = (bookingId?: number) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [hotel, setHotel] = useState<any>(null);
  const [amountAlreadyPaid, setAmountAlreadyPaid] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) return navigate("/");
      try {
        const bookingData = await fetchBookingById(bookingId);
        setBooking(bookingData);

        const hotelData = await hotelApi.fetchHotelById(bookingData.hotelId);
        setHotel(hotelData);

        const payments = await paymentApi.getPaymentsByBookingId(bookingId);
        const totalPaid = payments?.length ? payments.reduce((sum, p) => sum + Number(p.amountPaid), 0) : 0;
        setAmountAlreadyPaid(totalPaid);
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId, navigate]);

  return { booking, hotel, amountAlreadyPaid, loading };
};