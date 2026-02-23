// hooks/useHotelActions.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../services/Hotel";
import { userApi } from "../services/User";

export const useHotelActions = (hotelId: number | null, setReviews: any, setUserInfo: any) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [message, setMessage] = useState("");

  const confirmDeletion = async () => {
    if (!hotelId) return;
    try {
      await hotelApi.deleteHotel(hotelId);
      setIsDeleteModalOpen(false);
      setMessage("Hotel deleted successfully!");
      setMessageType("success");
      setIsMessageOpen(true);
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMessage("Failed to delete hotel.");
      setMessageType("error");
      setIsMessageOpen(true);
    }
  };

  const handleReviewSubmitted = async (review: any) => {
    if (!review) return;
    setReviews((prev: any) => [...prev, review]);
    const user = await userApi.getUserInfo(String(review.userId));
    setUserInfo((prev: any) => ({ ...prev, [review.userId]: user.user }));
  };

  return {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isMessageOpen,
    setIsMessageOpen,
    messageType,
    message,
    setMessageType,
    setMessage,
    confirmDeletion,
    handleReviewSubmitted
  };
};