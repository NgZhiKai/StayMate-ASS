import axios from "axios";
import { PAYMENT_BASE_URL } from "../../constants/constants";

export const paymentApiClient = axios.create({
  baseURL: PAYMENT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});