import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";

export default function ProtectedLayout() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
