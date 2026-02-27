import React, { createContext, ReactNode, useEffect, useState } from "react";
import { userApi } from "../services/User";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  userId: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch role from API if userId exists
  const fetchUserRole = async (id: string) => {
    try {
      const { user } = await userApi.getUserInfo(id);
      setRole(user.role.toLowerCase());
      sessionStorage.setItem("role", user.role.toLowerCase());
      if (user.firstName) sessionStorage.setItem("firstName", user.firstName);
      if (user.lastName) sessionStorage.setItem("lastName", user.lastName);
    } catch (err) {
      console.error("Failed to fetch user role:", err);
      setRole(null);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedUserId = sessionStorage.getItem("userId");

    setIsLoggedIn(!!token);
    setUserId(savedUserId);

    if (savedUserId) {
      fetchUserRole(savedUserId);
    }
  }, []);

  const login = (token: string, id: string) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userId", id);
    setIsLoggedIn(true);
    setUserId(id);

    fetchUserRole(id); // fetch role after login
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("firstName");
    sessionStorage.removeItem("lastName");


    setIsLoggedIn(false);
    setUserId(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};