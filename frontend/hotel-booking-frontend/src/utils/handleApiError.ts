export const handleApiError = (err: any): string => {
  if (err.response) {
    // Server responded (401, 403, 500, etc.)
    return (
      err.response.data?.message ||
      err.response.data?.error ||
      "Request failed. Please try again."
    );
  }

  if (err.request) {
    // No response received
    return "No response from server. Please check your connection.";
  }

  return err.message || "Something went wrong.";
};