import { Calendar as CalendarIcon, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useNotificationContext } from "../../contexts/NotificationContext";
import { useDropdownManager } from "../../hooks/useDropdownManager";
import CalendarDropdown from "./CalendarDropdown";
import NotificationDropdown from "./NotificationDropdown";
import UserMenu from "./UserMenu";

export default function Header() {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { notifications } = useNotificationContext();

  const { activeDropdown, toggleDropdown, closeAll } = useDropdownManager();

  // Get user info from sessionStorage
  const userFirstName = sessionStorage.getItem("firstName") || "";
  const userLastName = sessionStorage.getItem("lastName") || "";
  const userId = sessionStorage.getItem("userId");

  // Build initials (first letter of first + first letter of last)
  const userInitials = `${userFirstName.charAt(0)}${userLastName.charAt(0)}` || "U";

  /* Outside Click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAll]);

  /* Keyboard handler for divs acting like buttons */
  const handleKeyPress =
    (callback: () => void) => (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        callback();
      }
    };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 z-[9999] select-none">
      {/* LEFT SIDE */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
            SM
          </div>
          <span className="ml-3 text-2xl font-serif italic font-semibold text-gray-800">
            StayMate
          </span>
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-4 relative" ref={wrapperRef}>
        {userId ? (
          <>
            {/* Calendar */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("calendar")}
                className="p-2 rounded-full hover:bg-gray-100 transition relative focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "calendar"}
              >
                <CalendarIcon className="w-6 h-6 text-gray-700" />
              </button>
              <CalendarDropdown isOpen={activeDropdown === "calendar"} />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("notifications")}
                className="p-2 rounded-full hover:bg-gray-100 transition relative focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-haspopup="true"
                aria-expanded={activeDropdown === "notifications"}
              >
                <Mail className="w-6 h-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg">
                    {notifications.filter(n => !n.isread).length}
                  </span>
                )}
              </button>
              <NotificationDropdown isOpen={activeDropdown === "notifications"} />
            </div>

            {/* User Menu */}
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
          </>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
}