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
    <div className="flex flex-col items-start w-full gap-1">
      <label htmlFor={name} className="pl-2 font-semibold">
        {children}
      </label>
      <input
        className={`${className || ""} ${errorMessage ? "border-error" : ""} px-2 py-1.5 md:px-2.5 md:py-3 lg:px-3 lg:py-2.5 mb-0.5 w-full rounded-lg border`}
        name={name}
        id={name}
        {...props}
      />
      {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
    </div>
  );
}
