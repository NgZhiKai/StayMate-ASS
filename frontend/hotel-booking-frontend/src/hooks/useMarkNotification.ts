import { useState } from "react";

export const useMarkNotification = (
  markAsRead: (id: number) => Promise<void>
) => {
  const [markingId, setMarkingId] = useState<number | null>(null);

  const handleMarkAsRead = async (id: number) => {
    try {
      setMarkingId(id);
      await markAsRead(id);
    } finally {
      setMarkingId(null);
    }
  };

  return {
    markingId,
    handleMarkAsRead,
  };
};