import { useContext } from "react";
import AuthContext from "../store/auth-context";
const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (authContext === null)
    throw new Error("Use that hook in AuthContextProvider children");
  return authContext;
};
export default useAuth;
