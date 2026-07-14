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
    <div className="flex flex-col items-start gap-0.5 w-full md:gap-1">
      <label
        htmlFor={name}
        className="pl-2 font-semibold text-sm sm:text-base md:text-lg xl:text-xl"
      >
        {children}
      </label>
      <input
        className={`${className || ""} ${errorMessage ? "border-error" : ""} p-1.5 mb-0.5 w-full rounded-lg border text-xs sm:text-sm md:text-base xl:text-lg`}
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
