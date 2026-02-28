import React, { useState } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  pages: (number | string)[];
  goToPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  pages,
  goToPage,
}) => {
  const [jumpValue, setJumpValue] = useState("");

  const handleJump = () => {
    const page = Number(jumpValue);
    if (!Number.isNaN(page)) {
      goToPage(page);
      setJumpValue("");
    }
  };

  if (totalPages <= 1) return null;
  let ellipsisCount = 0;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* Page Buttons */}
      <div className="flex items-center space-x-2 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Prev
        </button>

        {pages.map((page) =>
          page === "..." ? (
            <span key={`ellipsis-${++ellipsisCount}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(Number(page))}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform ${
                currentPage === page
                  ? "scale-110 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {/* Modern Jump-to-Page */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder="Jump to page"
          className="w-40 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm shadow-sm text-center"
        />
        <button
          onClick={handleJump}
          className="px-5 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 transform transition shadow-lg"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default Pagination;
