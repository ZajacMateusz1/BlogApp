import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import AuthContext, { type AuthContextType } from "./auth-context";

const getTokenExpireDate = (token: string | null): number => {
  if (!token) return -1;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    const exp = payload.exp;
    if (!exp) return -1;
    return exp * 1000;
  } catch {
    return -1;
  }
};

const initToken = localStorage.getItem("token");

interface AuthContextProviderProps {
  children: ReactNode;
}
export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [token, setToken] = useState<string | null>(initToken || null);
  const handleLogin = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  }, []);
  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
  }, []);
  useEffect(() => {
    if (!token) return;
    const expireDate = getTokenExpireDate(token);
    const timeLeft = expireDate - Date.now();
    const timer = setTimeout(() => handleLogout(), timeLeft);
    return () => clearTimeout(timer);
  }, [token, handleLogout]);
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
