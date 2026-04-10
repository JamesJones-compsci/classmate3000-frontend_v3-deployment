import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// Penny - import needed to allow dev access in mock mode
import { USE_MOCK_AUTH } from "../config/env";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  console.log("USE_MOCK_AUTH =", USE_MOCK_AUTH);
  console.log("user =", user);

  // Penny - allow dev access in mock mode
  if (USE_MOCK_AUTH) {
    return children;
  }

  // gateway JWT enforced #Nezihe
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
