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
    <div className="flex flex-col items-center gap-0.5 w-full">
      <label
        htmlFor={name}
        className="text-sm sm:text-base md:text-lg xl:text-xl"
      >
        {children}
      </label>
      <input
        className={`${className || ""} p-1.5 mb-0.5 min-w-1/2 rounded-lg border text-xs sm:text-sm md:text-base xl:text-lg`}
        name={name}
        id={name}
        {...props}
      />
      {errorMessage && (
        <p className="text-error text-xs sm:text-sm md:text-base xl:text-lg">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
