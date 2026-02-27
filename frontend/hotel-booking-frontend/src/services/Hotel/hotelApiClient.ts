import axios from "axios";
import { HOTEL_BASE_URL } from "../../constants/constants";

export const hotelApiClient = axios.create({
  baseURL: HOTEL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});