import type { ComponentPropsWithoutRef } from "react";

interface TextAreaElementProps extends ComponentPropsWithoutRef<"textarea"> {
  children: string;
  name: string;
  errorMessage?: string;
  className?: string;
}

export default function TextAreaElement({
  children,
  name,
  errorMessage,
  className,
  ...props
}: TextAreaElementProps) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      <label
        className="pl-2 font-semibold text-sm sm:text-base md:text-lg xl:text-xl"
        htmlFor={name}
      >
        {children}
      </label>
      <textarea
        className={`${className || ""} ${errorMessage ? "border-error" : ""} p-1.5 mb-0.5 min-h-24 rounded-lg w-full max-w-md border text-xs sm:text-sm md:text-base xl:text-lg md:min-h-28 lg:min-h-32`}
        id={name}
        name={name}
        {...props}
      ></textarea>
      {errorMessage && (
        <p className="text-error text-xs sm:text-sm md:text-base xl:text-lg">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
