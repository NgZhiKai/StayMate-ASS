import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi } from "../services/User";
import { RegisterData } from "../types/User";

export const useRegister = (initialData: RegisterData) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: number } | undefined;
  const verifiedUserId = state?.userId;

  const [formData, setFormData] = useState<RegisterData>({
    ...initialData,
    id: verifiedUserId,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailReadonly, setIsEmailReadonly] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prefill if redirected from verification
  useEffect(() => {
    if (!verifiedUserId) return;

    userApi.getUserInfo(String(verifiedUserId))
      .then(({ user }) => {
        if (!user) return;
        setFormData((prev) => ({
          ...prev,
          email: user.email || prev.email,
          firstName: user.firstName || prev.firstName,
          lastName: user.lastName || prev.lastName,
        }));
        if (user.email) setIsEmailReadonly(true);
      })
      .catch((err) => console.error("Failed to fetch user info:", err.message));
  }, [verifiedUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "email" && isEmailReadonly) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!formData.firstName || !formData.lastName || !formData.password || !formData.phoneNumber) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await userApi.registerUser(formData);
      setError(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    navigate("/login", { state: { message: "Registration completed. Please log in." } });
  };

  return {
    formData,
    confirmPassword,
    setConfirmPassword,
    handleChange,
    handleRegister,
    error,
    success,
    closeSuccess,
    isEmailReadonly,
  };
};