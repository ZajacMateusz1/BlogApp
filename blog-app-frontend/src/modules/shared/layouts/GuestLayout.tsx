import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
export default function GuestLayout() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return (
    <main className="mt-10 mx-2 md:mt-15 lg-mt:20">
      <Outlet />
    </main>
  );
}
