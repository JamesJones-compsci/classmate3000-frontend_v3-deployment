// src/auth/AuthContext.jsx
// Global authentication context for the ClassMate frontend.
// Provides login, logout, and user state to all child components via React Context.
//
// Token storage strategy:
//   - sessionStorage is used instead of localStorage for improved XSS protection.
//   - Tokens are cleared automatically when the browser tab is closed.
//   - Keycloak integration is planned for a future release (v2).

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user shape: { token: string } | null
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, restore session from sessionStorage if a token already exists.
    // This handles the case where the user refreshes the page mid-session.
    const token = sessionStorage.getItem("token");
    setUser(token ? { token } : null);
  }, []);

  // Called after a successful login API response.
  // Persists the token to sessionStorage and updates global user state.
  const login = (token) => {
    if (!token) {
      console.warn("login() called without a token — check the auth API response.");
      return;
    }
    sessionStorage.setItem("token", token);
    setUser({ token });
  };

  // Clears session state and redirects to login are handled by the caller (Dashboard).
  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook — use this in any component that needs auth state.
// Example: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);