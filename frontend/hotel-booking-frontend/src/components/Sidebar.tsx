import {
  Bell,
  Calendar,
  CheckCircle,
  ClipboardList,
  CreditCard,
  Hotel,
  LogIn,
  LogOut,
  MapPin,
  Settings,
  UserPlus,
  Users
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useNotificationContext } from "../contexts/NotificationContext";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({ isOpen }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const { notifications } = useNotificationContext();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isread).length;

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white p-4 shadow-lg transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-4">
        {/* Customer Links */}
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
          >
            <Hotel size={20} /> {role === "admin" ? "Manage Hotels" : "Hotels"}
          </Link>
          <Link
            to="/nearme"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
          >
            <MapPin size={20} /> Near Me
          </Link>
        </div>

        <hr className="border-gray-700" />

        {/* Unauthenticated Links */}
        {!isLoggedIn && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <LogIn size={20} /> Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <UserPlus size={20} /> Register
            </Link>
            <Link
              to="/verify"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <CheckCircle size={20} /> Verify
            </Link>
          </div>
        )}

        {/* Authenticated Customer */}
        {isLoggedIn && role === "customer" && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/bookmarked-hotels"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Hotel size={20} /> Bookmarked Hotels
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Bell size={20} /> Notifications
              {unreadCount > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link
              to="/bookings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Calendar size={20} /> My Bookings
            </Link>
            <Link
              to="/my-payments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <CreditCard size={20} /> My Payments
            </Link>
          </div>
        )}

        <hr className="border-gray-700" />

        {/* Admin Links */}
        {isLoggedIn && role === "admin" && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/notifications"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Bell size={20} /> Notifications
              {unreadCount > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-2">{unreadCount}</span>
              )}
            </Link>
            <Link
              to="/bookings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Calendar size={20} /> My Bookings
            </Link>

            {/* Admin Dropdown */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200 w-full text-left"
              >
                <ClipboardList size={20} /> Admin Actions
              </button>
              {isAdminDropdownOpen && (
                <div className="flex flex-col pl-6 mt-1 space-y-1">
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
                  >
                    <Users size={20} /> Manage Users
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
                  >
                    <CreditCard size={20} /> Payments Overview
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
                  >
                    <ClipboardList size={20} /> Bookings Summary
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/user-account-settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 shadow-sm transition-all duration-200"
            >
              <Settings size={20} /> Admin Settings
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;