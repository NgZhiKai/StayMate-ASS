import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { userApi } from "../services/User";
import { LoginData } from "../types/User";

export const useLoginHandlers = (initialData: LoginData) => {
  const [loginData, setLoginData] = useState<LoginData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("error");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: number } | undefined;

  useEffect(() => {
    if (!state?.userId) return;
    const fetchUser = async () => {
      try {
        const { user } = await userApi.getUserInfo(String(state.userId));
        if (!user) return;
        setLoginData((prev) => ({ ...prev, email: user.email || prev.email }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [state?.userId]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (data: LoginData) => {
    if (!data.email || !data.password) {
      setModalType("error");
      setModalMessage("Please enter both email and password.");
      setIsForgotOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const { user, token } = await userApi.loginUser(data);
      login(token, String(user.id));
      navigate("/");
    } catch (err: any) {
      setModalType("error");
      setModalMessage(err.message || "Login failed");
      setIsForgotOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginData.email.trim()) {
      setModalType("error");
      setModalMessage("Please enter your email to reset password.");
      setIsForgotOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      await userApi.forgotPassword(loginData.email.trim());
      setModalType("success");
      setModalMessage("Reset token sent! Check your email.");
      setIsForgotOpen(true);
      setTimeout(() => navigate("/verify-reset-token"), 2000);
    } catch (err: any) {
      setModalType("error");
      setModalMessage(err.message || "Failed to send reset token.");
      setIsForgotOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginData,
    setLoginData,
    isLoading,
    isForgotOpen,
    setIsForgotOpen,
    modalMessage,
    modalType,
    handleLoginChange,
    handleLogin,
    handleForgotPassword,
  };
};