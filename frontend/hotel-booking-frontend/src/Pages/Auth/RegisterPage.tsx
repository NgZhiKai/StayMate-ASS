import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterForm from "../../components/User/RegisterForm";
import BrandingPanel from "../../components/User/BrandingPanel";
import SuccessModal from "../../components/Modal/SuccessModal";
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
  const [isEmailReadonly, setIsEmailReadonly] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load user info if redirected from verification
  useEffect(() => {
    if (!verifiedUserId) return;

    setRegisterData((prev) => ({ ...prev, id: verifiedUserId }));

    getUserInfo(String(verifiedUserId))
      .then(({ user }) => {
        if (!user) return;

        setRegisterData((prev) => ({
          ...prev,
          email: user.email || prev.email,
          firstName: user.firstName || prev.firstName,
          lastName: user.lastName || prev.lastName,
        }));
        if (user.email) setIsEmailReadonly(true);
      })
      .catch((err) => console.error("Failed to fetch user info:", err.message));
  }, [verifiedUserId]);

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "email" && isEmailReadonly) return;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
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
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    navigate("/login", { state: { message: "Registration completed. Please log in." } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 select-none">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left branding panel */}
        <div className="hidden md:flex md:w-1/2">
          <BrandingPanel
            title="Welcome to StayMate"
            subtitle="Book smarter. Stay better. Your perfect stay starts here."
            gradient="from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-10 bg-white rounded-tr-3xl rounded-br-3xl">
          <div className="w-full max-w-md">

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <RegisterForm
              registerData={registerData}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleChange={handleRegisterChange}
              onRegister={handleRegister}
              isEmailReadonly={isEmailReadonly}
              error={error}
            />
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={success}
        message="Registration Successful!"
        onClose={closeSuccess}
        duration={2000}
      />
    </div>
  );
};

export default RegisterPage;