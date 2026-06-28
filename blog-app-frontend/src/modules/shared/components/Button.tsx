import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variants = {
  solid: "bg-primary text-white border-transparent",
  outlined: "border-primary text-primary",
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
      className={`${className || ""} ${variants[variant]} flex gap-2 border p-1.5 text-base rounded-md hover:cursor-pointer sm:text-lg lg:p-2 xl:text-xl`}
      {...props}
    >
      {children}
    </button>
  );
}
