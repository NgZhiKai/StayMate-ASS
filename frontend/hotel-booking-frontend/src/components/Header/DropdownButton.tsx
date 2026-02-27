interface DropdownButtonProps {
  onClick: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  badgeCount?: number;
}

export const DropdownButton = ({
  onClick,
  isOpen,
  children,
  badgeCount = 0,
}: DropdownButtonProps) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 transition relative focus:outline-none focus:ring-2 focus:ring-indigo-400"
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      {children}
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg">
          {badgeCount}
        </span>
      )}
    </button>
  </div>
);