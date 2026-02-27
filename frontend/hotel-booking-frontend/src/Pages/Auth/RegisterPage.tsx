import React from "react";
import { RegisterPageLayout, RegisterForm } from "../../components/Auth/Register";
import { useRegister } from "../../hooks/useRegister";

const RegisterPage: React.FC = () => {
  const {
    formData,
    confirmPassword,
    setConfirmPassword,
    handleChange,
    handleRegister,
    error,
    success,
    closeSuccess,
    isEmailReadonly,
  } = useRegister({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "CUSTOMER",
    id: undefined,
  });

  return (
    <RegisterPageLayout success={success} closeSuccess={closeSuccess}>
      <RegisterForm
        registerData={formData}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleChange={handleChange}
        onRegister={handleRegister}
        isEmailReadonly={isEmailReadonly}
        error={error}
      />
    </RegisterPageLayout>
  );
};

export default RegisterPage;