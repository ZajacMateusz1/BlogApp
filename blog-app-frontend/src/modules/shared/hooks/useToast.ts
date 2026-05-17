import { useContext } from "react";
import ToastContext from "../store/toast/toast-context";

const useToast = () => {
  const toastContext = useContext(ToastContext);
  if (toastContext === null)
    throw new Error("Use that hook in ToastContextProvider children");
  return toastContext;
};

export default useToast;
