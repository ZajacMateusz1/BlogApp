import { useState, useCallback, useMemo, type ReactNode } from "react";
import AuthContext, { type AuthContextType } from "./auth-context";
interface AuthContextProviderProps {
  children: ReactNode;
}
export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const handleLogin = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  }, []);
  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
  }, []);
  const authCTX: AuthContextType = useMemo(
    () => ({
      token,
      handleLogin,
      handleLogout,
    }),
    [token, handleLogin, handleLogout],
  );
  return <AuthContext value={authCTX}>{children}</AuthContext>;
}
