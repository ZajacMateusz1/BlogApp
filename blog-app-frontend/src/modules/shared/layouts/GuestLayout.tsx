import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
export default function GuestLayout() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
