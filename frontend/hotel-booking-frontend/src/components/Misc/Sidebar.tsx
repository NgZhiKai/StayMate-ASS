import {
  ClipboardList,
  CreditCard,
  Hotel,
  MapPin,
  Users
} from "lucide-react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[]; // optional role restriction
}

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const location = useLocation();

  const exploreMenu: MenuItem[] = [
    {
      label: "Hotels",
      path: "/",
      icon: <Hotel size={20} />
    },
    {
      label: "Near Me",
      path: "/nearme",
      icon: <MapPin size={20} />
    }
  ];

  const personalMenu: MenuItem[] = [
    {
      label: "Bookmarked Hotels",
      path: "/bookmarked-hotels",
      icon: <Hotel size={20} />,
      roles: ["customer", "admin"]
    },
    {
      label: "My Payments",
      path: "/my-payments",
      icon: <CreditCard size={20} />,
      roles: ["customer", "admin"]
    }
  ];

  const adminMenu: MenuItem[] = [
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: <Users size={20} />,
      roles: ["admin"]
    },
    {
      label: "Payments Overview",
      path: "/admin/payments",
      icon: <CreditCard size={20} />,
      roles: ["admin"]
    },
    {
      label: "Bookings Summary",
      path: "/admin/bookings",
      icon: <ClipboardList size={20} />,
      roles: ["admin"]
    },
    {
      label: "Add Hotel",
      path: "/create-hotel",
      icon: <Hotel size={20} />,
      roles: ["admin"]
    }
  ];

  const renderMenu = (items: MenuItem[]) =>
    items
      .filter(
        (item) =>
          !item.roles ||
          (isLoggedIn && item.roles.includes(role || ""))
      )
      .map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-white/20 backdrop-blur shadow-lg"
                  : "hover:bg-white/10"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      });

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 select-none
      bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-500
      text-white p-6 shadow-2xl rounded-tr-3xl rounded-br-3xl
      transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
    >
      <nav className="flex flex-col space-y-6">

        {/* Explore */}
        <div>
          <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
            Explore
          </p>
          <div className="flex flex-col space-y-2">
            {renderMenu(exploreMenu)}
          </div>
        </div>

        {/* Personal */}
        {isLoggedIn && (
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
              Personal
            </p>
            <div className="flex flex-col space-y-2">
              {renderMenu(personalMenu)}
            </div>
          </div>
        )}

        {/* Admin */}
        {isLoggedIn && role === "admin" && (
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
              Admin
            </p>
            <div className="flex flex-col space-y-2">
              {renderMenu(adminMenu)}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;