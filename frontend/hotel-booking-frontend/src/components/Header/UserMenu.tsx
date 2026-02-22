import { useNavigate } from "react-router-dom";
import DropdownWrapper from "./DropdownWrapper";

interface Props {
  isOpen: boolean;
  initial: string;
  onLogout?: () => void; // optional
}

export default function UserMenu({ isOpen, initial, onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        type="button"
        className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {initial || "U"}
      </button>

      <DropdownWrapper isOpen={isOpen}>
        <ul className="w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <li>
            <button
              type="button"
              onClick={() => navigate("/user-account-settings")}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-100"
            >
              Settings
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                navigate("/logout");
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-100"
            >
              Logout
            </button>
          </li>
        </ul>
      </DropdownWrapper>
    </div>
  );
}