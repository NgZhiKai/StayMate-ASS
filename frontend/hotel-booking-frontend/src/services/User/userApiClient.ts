import { USER_BASE_URL } from "../../constants/constants";
import { createApiClient } from "../_core/httpClient";

export const userApiClient = createApiClient(USER_BASE_URL);
