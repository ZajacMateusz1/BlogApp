import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
export default function GuestLayout() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return (
    <main className="flex mx-auto min-h-screen items-center justify-center px-2">
      <Outlet />
    </main>
  );
}
