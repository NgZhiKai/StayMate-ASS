import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav
      className="bg-white/70 backdrop-blur-md rounded-full px-4 py-2 inline-block shadow-sm"
      aria-label="Breadcrumb"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="hover:text-pink-600 hover:underline transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${
                    isLast
                      ? "bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent font-semibold"
                      : "text-gray-900 font-medium"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;