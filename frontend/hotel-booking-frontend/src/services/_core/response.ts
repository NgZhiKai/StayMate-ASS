type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  error?: string;
};

export const getDataOrThrow = <T>(payload: ApiEnvelope<T> | undefined, fallbackMessage: string): T => {
  if (payload?.data !== undefined && payload?.data !== null) {
    return payload.data;
  }
  throw new Error(payload?.message || payload?.error || fallbackMessage);
};

export const getDataOrDefault = <T>(payload: ApiEnvelope<T> | undefined, fallbackValue: T): T => {
  if (payload?.data !== undefined && payload?.data !== null) {
    return payload.data;
  }
  return fallbackValue;
};

export const getMessageOrThrow = (
  payload: { message?: string; error?: string } | undefined,
  fallbackMessage: string
): string => {
  if (payload?.message) {
    return payload.message;
  }
  throw new Error(payload?.error || fallbackMessage);
};
