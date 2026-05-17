import { createContext } from "react";

export type ToastVariants = "success" | "error" | "info";
export type ToastType = {
  id: string;
  message: string;
  type: ToastVariants;
};

export interface ToastContextType {
  addToast: (message: string, type: ToastVariants) => void;
}
const ToastContext = createContext<ToastContextType | null>(null);

export default ToastContext;
