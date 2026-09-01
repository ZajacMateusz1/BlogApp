import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variants = {
  solid:
    "bg-primary text-light border-primary hover:bg-link-hover hover:border-link-hover",
  outlined: "border-primary text-primary hover:bg-primary hover:text-light",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outlined";
}
export default function Button({
  children,
  className,
  variant = "solid",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${className || ""} ${variants[variant]} flex gap-2 border transition-colors p-1.5 text-base rounded-lg 
      disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer md:p-2 lg:text-lg lg:px-4`}
      {...props}
    >
      {children}
    </button>
  );
}
