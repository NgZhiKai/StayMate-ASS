import { PAYMENT_BASE_URL } from "../../constants/constants";
import { createApiClient } from "../_core/httpClient";

export const paymentApiClient = createApiClient(PAYMENT_BASE_URL);
