import { type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const variants = {
  solid:
    "bg-primary text-light border-primary hover:bg-link-hover hover:border-link-hover",
  outlined: "border-primary text-primary hover:bg-primary hover:text-light",
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
      className={`${className || ""} ${variants[variant]} flex justify-center transition-colors rounded-lg gap-2 border p-1.5 text-base hover:cursor-pointer 
      lg:p-2 xl:text-xl`}
      {...props}
    >
      {children}
    </Link>
  );
}
