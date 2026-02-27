import axios from "axios";
import { USER_BASE_URL } from "../../constants/constants";

export const userApiClient = axios.create({
  baseURL: USER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});