import React from "react";

interface Props {
  children: React.ReactNode;
}

const NotificationLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="p-6 min-h-full bg-gray-50 select-none">
      {children}
    </div>
  );
};

export default NotificationLayout;