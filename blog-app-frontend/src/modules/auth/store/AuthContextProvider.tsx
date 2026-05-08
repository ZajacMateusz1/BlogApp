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
const initUserId = localStorage.getItem("userId");

interface AuthContextProviderProps {
  children: ReactNode;
}
export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [token, setToken] = useState<string | null>(initToken || null);
  const [userId, setUserId] = useState<string | null>(initUserId || null);
  const handleLogin = useCallback((newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
  }, []);
  const handleLogout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
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
      userId,
      handleLogin,
      handleLogout,
    }),
    [token, handleLogin, handleLogout, userId],
  );
  return <AuthContext value={authCTX}>{children}</AuthContext>;
}
