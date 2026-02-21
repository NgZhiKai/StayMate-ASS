import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../../components/User/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserInfo, loginUser } from "../../services/User/userApi";
import { LoginData } from "../../types/User";

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

  useEffect(() => {
  const fetchUserInfo = async () => {
    if (state?.userId) {
      try {
        const { user } = await getUserInfo(String(state.userId));

        setLoginData((prev) => ({
          ...prev,
          email: user?.email || prev.email,
          role: user?.role === "customer" || user?.role === "admin" ? user.role : prev.role,
        }));

        if (user?.email) {
          setIsEmailReadonly(true); // make email read-only
        }
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
      navigate("/");
    } catch (err: any) {
      setError(
        err.message || "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 sel select-none">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Branding Panel */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4">Staymate</h1>
          <p className="text-lg text-center opacity-90">Book smarter. Stay better.</p>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-10">
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
  );
};

export default LoginPage;