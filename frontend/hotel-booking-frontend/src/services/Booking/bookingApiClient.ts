import { BOOKING_BASE_URL } from "../../constants/constants";
import { createApiClient } from "../_core/httpClient";

export const bookingApiClient = createApiClient(BOOKING_BASE_URL);
