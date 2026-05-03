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
      <div className="flex flex-col items-center gap-0.5 text-xs">
        <label htmlFor={name}>{children}</label>
        <input
          className={`${className} p-1 rounded-lg border text-xs`}
          name={name}
          id={name}
          {...props}
        />
        {errorMessage && <p className="text-error">{errorMessage}</p>}
      </div>
    </>
  );
}
