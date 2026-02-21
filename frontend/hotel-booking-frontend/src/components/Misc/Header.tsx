import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { getUserInfo } from '../../services/User/userApi';

interface HeaderProps {
  toggleSidebar?: () => void;
  hideToggle?: boolean;
}

export default function Header({ toggleSidebar, hideToggle }: HeaderProps) {
  const navigate = useNavigate();
  const userRef = useRef<HTMLDivElement>(null);
  const userId = sessionStorage.getItem('userId');

  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userInitial, setUserInitial] = useState('');

  const { notifications } = useNotificationContext();
  const unreadCount = notifications.filter(n => !n.isread).length;

  // Fetch user initial
  useEffect(() => {
    if (!userId) return;
    const fetchUserInitial = async () => {
      try {
        const { user } = await getUserInfo(userId);
        if (user?.firstName) setUserInitial(user.firstName.charAt(0).toUpperCase());
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUserInitial();
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToSettings = () => {
    navigate('/user-account-settings');
    setUserDropdownVisible(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/logout');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center px-6 z-50 select-none">
      {/* Left: Logo + Sidebar Toggle */}
      <div className="flex items-center flex-1">
        {!hideToggle && toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded hover:bg-gray-100 transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            SM
          </div>
          <span className="ml-3 text-2xl font-serif italic font-semibold text-gray-800 select-none">
            StayMate
          </span>
        </div>
      </div>

      {/* Right: Mail icon + User */}
      <div className="flex items-center space-x-4 relative" ref={userRef}>
        {userId ? (
          <>
            {/* Mail icon with unread badge */}
            <div className="relative">
              <button
                onClick={() => navigate('/notifications')}
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8m18 0L12 13 3 8"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User initial circle */}
            <div className="relative">
              <div
                className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer"
                onClick={() => setUserDropdownVisible(!userDropdownVisible)}
              >
                {userInitial || 'U'}
              </div>

              {userDropdownVisible && (
                <ul className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-gray-800 divide-y divide-gray-100 overflow-hidden">
                  <li
                    onClick={goToSettings}
                    className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 transition"
                  >
                    Settings
                  </li>
                  <li
                    onClick={handleLogout}
                    className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 transition"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
        <button
          onClick={() => navigate('/signin')}
          className="px-4 py-2 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
        >
          Login / Sign Up
        </button>
        )}
      </div>
    </header>
  );
}