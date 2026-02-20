import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // While logging in, don’t redirect — optionally show a spinner
    if (loading) return <div>Loading...</div>;

    // If user exists, show the protected page, otherwise redirect
    return user ? children : <Navigate to="/login" replace />;
}