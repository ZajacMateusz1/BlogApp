import type { ComponentPropsWithoutRef, ReactNode } from "react";
interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  className?: string;
}
export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`${className || ""} bg-primary p-1.5 text-base text-white rounded-md hover:cursor-pointer sm:text-lg lg:p-2 xl:text-xl`}
      {...props}
    >
      {children}
    </button>
  );
}
