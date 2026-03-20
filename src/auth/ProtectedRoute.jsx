import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // gateway JWT enforced #Nezihe
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}