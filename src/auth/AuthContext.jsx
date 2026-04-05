// src/auth/AuthContext.jsx
// Global authentication context for ClassMate.
// Stores JWT token, firstName, lastName, and email in sessionStorage.
// sessionStorage is cleared automatically when the browser tab is closed.

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token     = sessionStorage.getItem("token");
    const firstName = sessionStorage.getItem("firstName") ?? "";
    const lastName  = sessionStorage.getItem("lastName")  ?? "";
    const email     = sessionStorage.getItem("email")     ?? "";
    setUser(token ? { token, firstName, lastName, email } : null);
  }, []);

  const login = (token, firstName = "", lastName = "", email = "") => {
    if (!token) {
      console.warn("login() called without a token.");
      return;
    }
    sessionStorage.setItem("token",     token);
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName",  lastName);
    sessionStorage.setItem("email",     email);
    setUser({ token, firstName, lastName, email });
  };

  const updateProfile = ({ firstName = "", lastName = "", email = "" }) => {
    setUser((prev) => {
      if (!prev) return prev;

      const nextUser = {
        ...prev,
        firstName,
        lastName,
        email,
      };

      sessionStorage.setItem("firstName", firstName);
      sessionStorage.setItem("lastName", lastName);
      sessionStorage.setItem("email", email);

      return nextUser;
    });
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("firstName");
    sessionStorage.removeItem("lastName");
    sessionStorage.removeItem("email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);