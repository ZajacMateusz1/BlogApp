import { type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const variants = {
  solid: "bg-primary text-white border-transparent",
  outlined: "border-primary text-primary",
};

interface LinkButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outlined";
}
export default function LinkButton({
  children,
  className,
  variant = "solid",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${className || ""} ${variants[variant]} text-center border p-1.5 text-base rounded-md hover:cursor-pointer sm:text-lg lg:p-2 xl:text-xl`}
      {...props}
    >
      {children}
    </Link>
  );
}
