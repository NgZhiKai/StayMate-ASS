import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../../components/User/LoginForm";
import BrandingPanel from "../../components/User/BrandingPanel";

import { AuthContext } from "../../contexts/AuthContext";
import { getUserInfo, loginUser } from "../../services/User/userApi";
import { LoginData } from "../../types/User";

import { useNotificationContext } from "../../contexts/NotificationContext";
import { useBookingContext } from "../../contexts/BookingContext";

const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState<string | null>(null);
  const [isEmailReadonly, setIsEmailReadonly] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: number } | undefined;

  const { refreshNotifications } = useNotificationContext();
  const { refreshBookings } = useBookingContext();

  // Fetch user info if redirected from registration or verification
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (state?.userId) {
        try {
          const { user } = await getUserInfo(String(state.userId));
          if (!user) return;

          setLoginData((prev) => ({
            ...prev,
            email: user.email || prev.email,
            role:
              user.role === "customer" || user.role === "admin"
                ? user.role
                : prev.role,
          }));

          if (user.email) setIsEmailReadonly(true);
        } catch (err: any) {
          console.error("Failed to fetch user info:", err.message);
        }
      }
    };
    fetchUserInfo();
  }, [state?.userId]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (data: LoginData) => {
    if (!data.email || !data.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const { user, token } = await loginUser(data);
      login(token, data.role, String(user.id));
      setError(null);

      try {
        await Promise.all([refreshBookings(), refreshNotifications()]);
      } catch (err) {
        console.error("Failed to refresh data after login:", err);
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 select-none">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Branding Panel */}
        <div className="hidden md:flex md:w-1/2">
          <BrandingPanel
            title="Welcome Back to StayMate"
            subtitle="Book smarter. Stay better. Your perfect stay starts here."
            gradient="from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-10 bg-white rounded-tr-3xl rounded-br-3xl">
          <div className="w-full max-w-md">

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <LoginForm
              loginData={loginData}
              error={error}
              onLogin={handleLogin}
              handleChange={handleLoginChange}
              isEmailReadonly={isEmailReadonly}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;