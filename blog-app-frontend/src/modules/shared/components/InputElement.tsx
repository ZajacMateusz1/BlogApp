import type { ComponentPropsWithoutRef } from "react";
interface InputElementProps extends ComponentPropsWithoutRef<"input"> {
  children: string;
  name: string;
  errorMessage?: string;
  className?: string;
}
export default function InputElement({
  children,
  name,
  errorMessage,
  className,
  ...props
}: InputElementProps) {
  return (
    <>
      <div>
        <label htmlFor={name}>{children}</label>
        <input className={`${className}`} name={name} id={name} {...props} />
      </div>
      <p>{errorMessage}</p>
    </>
  );
}
