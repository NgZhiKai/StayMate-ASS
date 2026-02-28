import { useNavigate } from "react-router-dom";

interface HeaderLeftProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const HeaderLeft = ({ toggleSidebar, isSidebarOpen }: HeaderLeftProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="relative w-10 h-10 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span
          className={`absolute left-2 right-2 top-3 h-0.5 bg-gray-700 transition-transform duration-300 ${
            isSidebarOpen ? "translate-y-1.5 rotate-45" : ""
          }`}
        />
        <span
          className={`absolute left-2 right-2 top-5 h-0.5 bg-gray-700 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute left-2 right-2 top-7 h-0.5 bg-gray-700 transition-transform duration-300 ${
            isSidebarOpen ? "-translate-y-2.5 -rotate-45" : ""
          }`}
        />
      </button>

      <button
        type="button"
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
  );
};
