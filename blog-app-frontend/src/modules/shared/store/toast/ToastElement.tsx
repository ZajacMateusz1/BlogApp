import { Link } from "react-router-dom";
import type { ToastVariants } from "./toast-context";

interface ToastElementProps {
  children: string;
  type: ToastVariants;
  link?: string;
}
export default function ToastElement({
  children,
  type,
  link,
}: ToastElementProps) {
  let styles = "rounded-lg border px-2 py-1 m-1 md:text-lg lg:text-xl ";
  switch (type) {
    case "success":
      styles += "text-green-600 border-green-200 bg-green-100";
      break;
    case "error":
      styles += "text-error border-red-200 bg-red-50";
      break;
    case "info":
      styles += "text-blue-600 border-blue-200 bg-blue-100";
      break;
  }
  if (link)
    return (
      <div className={styles}>
        <Link to={link} className="size-full">
          {children}
        </Link>
      </div>
    );
  return <div className={styles}>{children}</div>;
}
