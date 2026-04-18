import { createContext } from "react";
export interface AuthContextType {
  token: string | null;
  handleLogin: (newToken: string) => void;
  handleLogout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  token: null,
  handleLogin: () => {},
  handleLogout: () => {},
});
export default AuthContext;
