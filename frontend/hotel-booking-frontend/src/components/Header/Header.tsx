import { HeaderLeft } from "./HeaderLeft";
import { UserActions } from "./UserActions";

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  hideToggle?: boolean;
}

export default function Header({
  toggleSidebar,
  isSidebarOpen = false,
  hideToggle = false,
}: Readonly<HeaderProps>) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 z-[9999] select-none">
      {hideToggle ? (
        <div />
      ) : (
        <HeaderLeft
          toggleSidebar={toggleSidebar ?? (() => {})}
          isSidebarOpen={isSidebarOpen}
        />
      )}
      <UserActions />
    </header>
  );
}
