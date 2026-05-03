import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function AuthLayout() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}
