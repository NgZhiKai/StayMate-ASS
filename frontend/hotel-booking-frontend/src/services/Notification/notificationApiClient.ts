import { NOTIFICATION_BASE_URL } from "../../constants/constants";
import { createApiClient } from "../_core/httpClient";

export const notificationApiClient = createApiClient(NOTIFICATION_BASE_URL);
