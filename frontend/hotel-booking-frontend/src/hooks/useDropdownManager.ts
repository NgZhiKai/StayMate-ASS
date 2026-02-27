import { useState } from "react";

export type DropdownType =
  | "calendar"
  | "notifications"
  | "user"
  | null;

export function useDropdownManager() {
  const [activeDropdown, setActiveDropdown] =
    useState<DropdownType>(null);

  const toggleDropdown = (type: DropdownType) => {
    setActiveDropdown(prev =>
      prev === type ? null : type
    );
  };

  const closeAll = () => setActiveDropdown(null);

  return { activeDropdown, toggleDropdown, closeAll };
}