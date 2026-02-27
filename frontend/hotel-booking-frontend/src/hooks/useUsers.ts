import { useEffect, useState } from "react";
import { userApi } from "../services/User";
import { RegisterData, User } from "../types/User";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [messageContent, setMessageContent] = useState("");
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Refetch users only after a success message modal closes
  useEffect(() => {
    if (!messageModalOpen && messageType === "success") {
      fetchUsers();
    }
  }, [messageModalOpen, messageType]);

  const fetchUsers = async () => {
    try {
      const result = await userApi.getAllUsers();
      setUsers(result.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showMessage("error", "Failed to fetch users");
    }
  };

  const openCreateModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const deleteUser = async (userId: number) => {
    try {
      await userApi.deleteUser(String(userId));
      showMessage("success", "User deleted successfully!");
    } catch (error) {
      showMessage("error", "Failed to delete user");
    }
  };

  const submitUser = async (userData: User | RegisterData) => {
    try {
      if (userData.id === 0) {
        await userApi.registerUser(userData as RegisterData);
        showMessage("success", "User created successfully!");
      } else {
        await userApi.updateUser(String(userData.id), userData);
        showMessage("success", "User updated successfully!");
      }
      setIsModalOpen(false); // close modal after submit
    } catch (error) {
      showMessage("error", "Failed to submit user");
    }
  };

  const showMessage = (type: "success" | "error", message: string) => {
    setMessageType(type);
    setMessageContent(message);
    setMessageModalOpen(true);
  };

  return {
    users,
    currentUser,
    isModalOpen,
    messageType,
    messageContent,
    messageModalOpen,
    setIsModalOpen,
    setMessageModalOpen,
    openCreateModal,
    openEditModal,
    deleteUser,
    submitUser,
    fetchUsers,
  };
};