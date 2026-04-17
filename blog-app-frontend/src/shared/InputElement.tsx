import type { ComponentPropsWithoutRef } from "react";
interface InputElementProps extends ComponentPropsWithoutRef<"input"> {
  children: string;
  name: string;
  className?: string;
}
export default function InputElement({
  children,
  name,
  className,
  ...props
}: InputElementProps) {
  return (
    <>
      <label htmlFor={name}>{children}</label>
      <input className={`${className}`} name="name" {...props} />
    </>
  );
}
