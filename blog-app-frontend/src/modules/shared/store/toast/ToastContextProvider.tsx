import { useState, type ReactNode } from "react";
import ToastContext, {
  type ToastContextType,
  type ToastType,
  type ToastVariants,
} from "./toast-context";

import ToastElement from "./ToastElement";

interface ToastContextProviderProps {
  children: ReactNode;
}
export default function ToastContextProvider({
  children,
}: ToastContextProviderProps) {
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const addToast = (message: string, type: ToastVariants) => {
    const newToast: ToastType = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 3000);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  const toastCtx: ToastContextType = {
    addToast: addToast,
  };
  return (
    <ToastContext.Provider value={toastCtx}>
      <>
        {children}
        <div className="fixed left-3 top-3">
          {toasts.map((toast) => (
            <ToastElement key={toast.id} type={toast.type}>
              {toast.message}
            </ToastElement>
          ))}
        </div>
      </>
    </ToastContext.Provider>
  );
}
