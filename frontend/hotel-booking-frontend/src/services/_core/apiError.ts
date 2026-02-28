import { handleApiError } from "../../utils/handleApiError";

export const toApiError = (error: unknown): Error => {
  return new Error(handleApiError(error));
};
