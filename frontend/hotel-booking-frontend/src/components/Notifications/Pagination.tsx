import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, goToPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2 flex-wrap">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => goToPage(i + 1)}
          className={`px-3 py-1 rounded-xl font-semibold transition ${
            currentPage === i + 1
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;