import { createContext } from "react";
export interface AuthContextType {
  token: string | null;
  userId: string | null;
  handleLogin: (newToken: string, newUserId: string) => void;
  handleLogout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;
