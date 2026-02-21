import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotelData } from '../types/Hotels';
import { fetchHotels } from '../services/hotelApi';
import { getUserInfo } from '../services/userApi';

interface HeaderProps {
  toggleSidebar?: () => void;
  hideToggle?: boolean;
}

export default function Header({ toggleSidebar, hideToggle }: HeaderProps) {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const userId = sessionStorage.getItem('userId');

  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [search, setSearch] = useState('');
  const [filteredHotels, setFilteredHotels] = useState<HotelData[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userInitial, setUserInitial] = useState('');

  // Fetch hotels
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchHotels();
        if (Array.isArray(data)) setHotels(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadHotels();
  }, []);

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

  // Filter hotels
  useEffect(() => {
    if (!search.trim()) {
      setFilteredHotels([]);
      setDropdownVisible(false);
      return;
    }
    const filtered = hotels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredHotels(filtered);
    setDropdownVisible(filtered.length > 0);
  }, [search, hotels]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectHotel = (hotelId: number) => {
    navigate(`/hotel/${hotelId}`);
    setSearch('');
    setDropdownVisible(false);
  };

  const goToSettings = () => {
    navigate('/user-account-setting');
    setUserDropdownVisible(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/logout');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center px-6 z-50 select-none">
      {/* Left */}
      <div className="flex items-center flex-1">
        {!hideToggle && toggleSidebar && (
          <button onClick={toggleSidebar} className="mr-4 p-2 rounded hover:bg-gray-100 transition">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            SM
          </div>
          <span className="ml-3 text-2xl font-serif italic font-semibold text-gray-800 select-none">StayMate</span>
        </div>
      </div>

      {/* Search */}
      {!hideToggle && (
        <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hotels..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
            onFocus={() => filteredHotels.length > 0 && setDropdownVisible(true)}
          />
          {dropdownVisible && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-64 overflow-y-auto z-50">
              {filteredHotels.map(h => (
                <li
                  key={h.id}
                  onClick={() => handleSelectHotel(h.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition"
                >
                  {h.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* User actions */}
      <div className="flex items-center space-x-4 relative" ref={userRef}>
        {userId ? (
          <>
            {/* Bell icon */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405M19 13v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6M9 21h6M12 17v4" />
              </svg>
            </button>

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
                  <li onClick={goToSettings} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 transition">
                    Settings
                  </li>
                  <li onClick={handleLogout} className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 transition">
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate('/signin')}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
}