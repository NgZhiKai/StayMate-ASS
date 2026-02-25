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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const result = await userApi.getAllUsers();
    setUsers(result.users);
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
    await userApi.deleteUser(String(userId));
    setUsers(prev => prev.filter(u => u.id !== userId));
    showMessage("success", "User deleted successfully!");
  };

  const submitUser = async (userData: User | RegisterData) => {
    if (userData.id === 0) {
      const response = await userApi.registerUser(userData as RegisterData);
      setUsers(prev =>
        prev.map(u => (u.id === userData.id ? response.user : u))
      );
      showMessage("success", "User created successfully!");
    } else {
      const response = await userApi.updateUser(String(userData.id), userData);
      setUsers(prev =>
        prev.map(u => (u.id === userData.id ? response.user : u))
      );
      showMessage("success", "User updated successfully!");
    }

    setIsModalOpen(false);
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
  };
};