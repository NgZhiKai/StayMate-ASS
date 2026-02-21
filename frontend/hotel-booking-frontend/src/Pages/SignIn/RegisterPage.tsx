import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterForm from "../../components/User/RegisterForm";
import { getUserInfo, registerUser } from "../../services/User/userApi";
import { RegisterData } from "../../types/User";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: number } | undefined;
  const verifiedUserId = state?.userId;

  const [registerData, setRegisterData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER",
    id: verifiedUserId,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailReadonly, setIsEmailReadonly] = useState(false); // new state

  useEffect(() => {
    if (verifiedUserId) {
      setRegisterData((prev) => ({ ...prev, id: verifiedUserId }));

      getUserInfo(String(verifiedUserId))
        .then(({ user }) => {
          if (user?.email) {
            setRegisterData((prev) => ({ ...prev, email: user.email }));
            setIsEmailReadonly(true); // make email read-only
          }
          if (user?.firstName) {
            setRegisterData((prev) => ({ ...prev, firstName: user.firstName }));
          }
          if (user?.lastName) {
            setRegisterData((prev) => ({ ...prev, lastName: user.lastName }));
          }
        })
        .catch((err) => console.error("Failed to fetch user info:", err.message));
    }
  }, [verifiedUserId]);

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // prevent changing email if read-only
    if (name === "email" && isEmailReadonly) return;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (data: RegisterData) => {
    if (!data.firstName || !data.lastName || !data.password || !data.phoneNumber) {
      setError("Please fill in all fields.");
      return;
    }
    if (data.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(data);
      setError(null);

      // Delay 4s before navigating to login
      setTimeout(() => {
        navigate("/login", { state: { message: "Registration completed. Please log in." } });
      }, 4000);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 select-none">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex">

        {/* Left branding */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white/10 p-10 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to StayMate</h1>
          <p className="text-lg text-white/80 text-center">
            Book smarter. Stay better. Your perfect stay starts here.
          </p>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 bg-white p-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">{error}</div>
          )}

          <RegisterForm
            onRegister={handleRegister}
            error={error}
            registerData={registerData}
            handleChange={handleRegisterChange}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isEmailReadonly={isEmailReadonly} // pass down to form
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;