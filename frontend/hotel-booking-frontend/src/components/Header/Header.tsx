import { HeaderLeft } from "./HeaderLeft";
import { UserActions } from "./UserActions";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 z-[9999] select-none">
      <HeaderLeft toggleSidebar={toggleSidebar} />
      <UserActions />
    </header>
  );
}