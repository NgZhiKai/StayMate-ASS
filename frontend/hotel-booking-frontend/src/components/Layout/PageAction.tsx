import React from "react";

interface PageActionProps {
  onClick: () => void;
  label: string;
}

const PageAction: React.FC<PageActionProps> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
  >
    {label}
  </button>
);

export default PageAction;