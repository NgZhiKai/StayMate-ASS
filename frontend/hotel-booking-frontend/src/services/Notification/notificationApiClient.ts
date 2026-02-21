import axios from "axios";
import { NOTIFICATION_BASE_URL } from "../../constants/constants";

export const notificationApiClient = axios.create({
  baseURL: NOTIFICATION_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});