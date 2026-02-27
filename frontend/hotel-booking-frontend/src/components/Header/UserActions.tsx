import { Calendar as CalendarIcon, Mail } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useNotificationContext } from "../../contexts/NotificationContext";
import { useDropdownManager, useOutsideClick } from "../../hooks";
import CalendarDropdown from "./CalendarDropdown";
import { DropdownButton } from "./DropdownButton";
import NotificationDropdown from "./NotificationDropdown";
import UserMenu from "./UserMenu";

export const UserActions = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications } = useNotificationContext();
  const { activeDropdown, toggleDropdown, closeAll } = useDropdownManager();

  useOutsideClick(wrapperRef, closeAll);

  const userFirstName = sessionStorage.getItem("firstName") || "";
  const userLastName = sessionStorage.getItem("lastName") || "";
  const userId = sessionStorage.getItem("userId");
  const userInitials = `${userFirstName.charAt(0).toUpperCase()}${userLastName.charAt(0).toUpperCase()}` || "U";
  
  const handleKeyPress = (callback: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  if (!userId) {
    return (
      <button
        onClick={() => navigate("/signin")}
        className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Login / Sign Up
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4 relative" ref={wrapperRef}>
        <div className="relative">
            <DropdownButton
                onClick={() => toggleDropdown("calendar")}
                isOpen={activeDropdown === "calendar"}
            >
                <CalendarIcon className="w-6 h-6 text-gray-700" />
            </DropdownButton>
            <CalendarDropdown isOpen={activeDropdown === "calendar"} />
        </div>
        <div className="relative">
            <DropdownButton
                onClick={() => toggleDropdown("notifications")}
                isOpen={activeDropdown === "notifications"}
                badgeCount={notifications.filter((n) => !n.isread).length}
            >
                <Mail className="w-6 h-6 text-gray-700" />
            </DropdownButton>
            <NotificationDropdown isOpen={activeDropdown === "notifications"} />
        </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => toggleDropdown("user")}
        onKeyDown={handleKeyPress(() => toggleDropdown("user"))}
        className="relative focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
        aria-haspopup="true"
        aria-expanded={activeDropdown === "user"}
      >
        <UserMenu
          isOpen={activeDropdown === "user"}
          initial={userInitials}
          onLogout={() => {}}
        />
      </div>
    </div>
  );
};