import axios from "axios";
import { BOOKING_BASE_URL } from "../../constants/constants";

export const bookingApiClient = axios.create({
  baseURL: BOOKING_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});