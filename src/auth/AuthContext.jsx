import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Load token from localStorage if available
    const [user, setUser] = useState(
        localStorage.getItem("token") ? { token: localStorage.getItem("token") } : null
    );
    const [loading, setLoading] = useState(false);

    const login = (token) => {
        setLoading(true);
        localStorage.setItem("token", token);
        setUser({ token });
        setLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);