import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}
