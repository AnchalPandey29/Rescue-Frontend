// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Decode JWT to get expiration time
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true; // Invalid token or no exp claim
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        console.log("Token expired on initialization, logging out...");
        logout();
      } else {
        setIsLoggedIn(true);
        setToken(storedToken);
        setUser(storedUserData ? JSON.parse(storedUserData) : decodeToken(storedToken));
      }
    }
  }, []);

  // Periodic token expiration check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && isTokenExpired(storedToken)) {
        console.log("Token expired (1 hour elapsed), logging out...");
        logout();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const login = (userData, token) => {
    if (isTokenExpired(token)) {
      console.log("Token already expired on login, rejecting...");
      return;
    }
    setIsLoggedIn(true);
    setUser(userData);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    // Navigation moved to LoginPage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    // Navigation moved to components (e.g., useEffect in protected components)
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};