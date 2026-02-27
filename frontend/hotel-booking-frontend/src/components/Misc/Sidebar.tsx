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
  roles?: string[];
  section: string;
}

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: "Hotels", path: "/", icon: <Hotel size={20} />, section: "Explore" },
    { label: "Near Me", path: "/nearme", icon: <MapPin size={20} />, section: "Explore" },
    { label: "Bookmarked Hotels", path: "/bookmarked-hotels", icon: <Hotel size={20} />, roles: ["customer", "admin"], section: "Personal" },
    { label: "My Payments", path: "/my-payments", icon: <CreditCard size={20} />, roles: ["customer", "admin"], section: "Personal" },
    { label: "Manage Users", path: "/admin/users", icon: <Users size={20} />, roles: ["admin"], section: "Admin" },
    { label: "Payments Overview", path: "/admin/payments", icon: <CreditCard size={20} />, roles: ["admin"], section: "Admin" },
    { label: "Bookings Summary", path: "/admin/bookings", icon: <ClipboardList size={20} />, roles: ["admin"], section: "Admin" },
    { label: "Add Hotel", path: "/create-hotel", icon: <Hotel size={20} />, roles: ["admin"], section: "Admin" },
  ];

  const visibleItems = menuItems.filter(
    (item) => !item.roles || (isLoggedIn && item.roles.includes(role || ""))
  );

  const sections = Array.from(
    visibleItems.reduce((map, item) => {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section)!.push(item);
      return map;
    }, new Map<string, MenuItem[]>())
  );

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 select-none
        text-white p-6 shadow-2xl rounded-tr-3xl rounded-br-3xl
        transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      style={{
        background: "linear-gradient(to bottom, #770265, #9b30ff, #ff5ec4)",
        backgroundSize: "200% 200%",
        transition: "background-position 0.5s ease"
      }}
    >
      <nav className="flex flex-col space-y-6">
        {sections.map(([sectionName, items]) => (
          <div key={sectionName}>
            <p className="text-xs uppercase tracking-wider text-white/70 mb-2">
              {sectionName}
            </p>
            <div className="flex flex-col space-y-2">
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${isActive
                        ? "bg-white/20 backdrop-blur shadow-lg"
                        : "hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"}`
                    }
                    onMouseEnter={(e) => {
                      (e.currentTarget.parentElement!.parentElement!.style as any).backgroundPosition = "100% 0%";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget.parentElement!.parentElement!.style as any).backgroundPosition = "0% 0%";
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;