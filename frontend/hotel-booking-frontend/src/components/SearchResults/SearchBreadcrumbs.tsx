import React from "react";
import Breadcrumbs from "./Breadcrumbs";

interface SearchBreadcrumbsProps {
  city: string;
  country: string;
}

export const SearchBreadcrumbs: React.FC<SearchBreadcrumbsProps> = ({ city, country }) => {
  const items = [
    { label: "Home", path: "/" },
    ...(country ? [{ label: country, path: `/search?country=${country}` }] : []),
    ...(city ? [{ label: city }] : []),
    { label: "Search results" },
  ];
  return (
    <div className="relative px-6 max-w-7xl mx-auto">
      <Breadcrumbs items={items} />
    </div>
  );
};

export default SearchBreadcrumbs;