import type { ToastVariants } from "./toast-context";

interface ToastElementProps {
  children: string;
  type: ToastVariants;
}
export default function ToastElement({ children, type }: ToastElementProps) {
  let styles = "";
  switch (type) {
    case "success":
      styles = "text-green-600 border-green-200 bg-green-100";
      break;
    case "error":
      styles = "text-error border-red-200 bg-red-50";
      break;
    case "info":
      styles = "text-yellow-500 border-yellow-200 bg-yellow-100";
      break;
  }
  return (
    <div
      className={`${styles} rounded-lg border px-2 py-1 m-1  md:text-lg lg:text-xl`}
    >
      {children}
    </div>
  );
}
