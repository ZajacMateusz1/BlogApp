import { useCallback, useState, type ReactNode } from "react";
import ToastContext, {
  type ToastContextType,
  type ToastType,
  type ToastVariants,
} from "../toast-context";

import ToastElement from "../ToastElement";

interface ToastContextProviderProps {
  children: ReactNode;
}
export default function ToastContextProvider({
  children,
}: ToastContextProviderProps) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const addToast = useCallback(
    (message: string, type: ToastVariants, link?: string) => {
      const newToast: ToastType = {
        id: crypto.randomUUID(),
        message,
        type,
        link,
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        removeToast(newToast.id);
      }, 3000);
    },
    [setToasts],
  );
  const toastCtx: ToastContextType = {
    addToast,
  };
  return (
    <ToastContext value={toastCtx}>
      <>
        {children}
        <div className="fixed left-3 top-3 z-20">
          {toasts.map((toast) => (
            <ToastElement key={toast.id} type={toast.type} link={toast.link}>
              {toast.message}
            </ToastElement>
          ))}
        </div>
      </>
    </ToastContext>
  );
}
