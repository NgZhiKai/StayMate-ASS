import { HOTEL_BASE_URL } from "../../constants/constants";
import { createApiClient } from "../_core/httpClient";

export const hotelApiClient = createApiClient(HOTEL_BASE_URL);
