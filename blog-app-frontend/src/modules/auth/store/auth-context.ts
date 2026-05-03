import { createContext } from "react";
export interface AuthContextType {
  token: string | null;
  handleLogin: (newToken: string) => void;
  handleLogout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;
