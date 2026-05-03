import { createContext } from "react";
export interface AuthContextType {
  token: string | null;
  handleNewToken: (newToken: string) => void;
  handleLogout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export default AuthContext;
