import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AccountSettingsLayout: React.FC<Props> = ({ children }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
    >
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
};

export default AccountSettingsLayout;