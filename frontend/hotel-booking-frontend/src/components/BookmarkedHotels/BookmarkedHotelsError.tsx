import React from "react";

interface Props {
  message: string;
}

export const BookmarkedHotelsError: React.FC<Props> = ({ message }) => (
  <p className="text-red-600 text-center mt-8">{message}</p>
);

export default BookmarkedHotelsError;