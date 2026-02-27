import { useNavigate } from "react-router-dom";

interface HeaderLeftProps {
  toggleSidebar: () => void;
}

export const HeaderLeft = ({ toggleSidebar }: HeaderLeftProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700" />
      </button>

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
  );
};