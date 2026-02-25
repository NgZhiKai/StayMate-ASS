import {
  Calendar,
  ClipboardList,
  CreditCard,
  Hotel,
  MapPin,
  Settings,
  Users
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = ({
  isOpen,
  toggleSidebar,
}) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500 text-white p-6 shadow-2xl rounded-tr-3xl rounded-br-3xl transition-transform duration-300 z-40 select-none
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-4">
        {/* Customer Links */}
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
          >
            <Hotel size={20} /> {role === "admin" ? "Manage Hotels" : "Hotels"}
          </Link>
          <Link
            to="/nearme"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
          >
            <MapPin size={20} /> Near Me
          </Link>
        </div>

        <hr className="border-purple-300 opacity-50" />

        {/* Authenticated Customer */}
        {isLoggedIn && (
          <div className="flex flex-col space-y-2">
            <Link
              to="/bookmarked-hotels"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
            >
              <Hotel size={20} /> Bookmarked Hotels
            </Link>
            <Link
              to="/my-payments"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
            >
              <CreditCard size={20} /> My Payments
            </Link>
          </div>
        )}

        <hr className="border-purple-300 opacity-50" />

        {/* Admin Links */}
        {isLoggedIn && role === "admin" && (
          <div className="flex flex-col space-y-2">
            {/* Admin Dropdown */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-300 w-full text-left"
              >
                <ClipboardList size={20} /> Admin Actions
              </button>
              {isAdminDropdownOpen && (
                <div className="flex flex-col pl-6 mt-1 space-y-1">
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
                  >
                    <Users size={20} /> Manage Users
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
                  >
                    <CreditCard size={20} /> Payments Overview
                  </Link>
                  <Link
                    to="/admin/bookings"
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
                  >
                    <ClipboardList size={20} /> Bookings Summary
                  </Link>
                  {/* ✅ Add Hotel Link */}
                  <Link
                    to="/create-hotel"
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:opacity-90 shadow-md transition-all duration-300"
                  >
                    <Hotel size={20} /> Add Hotel
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;