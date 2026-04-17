import type { ComponentPropsWithoutRef } from "react";
interface InputElementProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  className?: string;
}
export default function InputElement({
  name,
  className,
  ...props
}: InputElementProps) {
  return (
    <>
      <label htmlFor={name}></label>
      <input className={`${className}`} name="name" {...props} />
    </>
  );
}
