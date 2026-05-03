import { useState, useCallback, useMemo, type ReactNode } from "react";
import AuthContext, { type AuthContextType } from "./auth-context";
interface AuthContextProviderProps {
  children: ReactNode;
}
const initToken = localStorage.getItem("token");
export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [token, setToken] = useState<string | null>(initToken || null);
  const handleNewToken = useCallback((newToken: string) => {
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
      handleNewToken,
      handleLogout,
    }),
    [token, handleNewToken, handleLogout],
  );
  return <AuthContext value={authCTX}>{children}</AuthContext>;
}
