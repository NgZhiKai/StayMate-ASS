import React from "react";
import { LoginPageLayout } from "../../components/Auth/Login";
import { useLoginHandlers } from "../../hooks/useLoginHandlers";
import { LoginData } from "../../types/User";

const LoginPage: React.FC = () => {
  const handlers = useLoginHandlers({
    email: "",
    password: "",
    role: "customer",
  } as LoginData);

  return <LoginPageLayout {...handlers} />;
};

export default LoginPage;