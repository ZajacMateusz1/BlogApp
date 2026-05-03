import type { ComponentPropsWithoutRef, ReactNode } from "react";
interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  className?: string;
}
export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${className} bg-primary text-white p-2 rounded-md hover:cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
