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
    <div className="flex flex-col items-center gap-0.5 w-full">
      <label
        className="text-sm sm:text-base md:text-lg xl:text-xl"
        htmlFor={name}
      >
        {children}
      </label>
      <textarea
        className={`${className || ""} p-1.5 mb-0.5 min-w-1/2 rounded-lg border text-xs sm:text-sm md:text-base xl:text-lg`}
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
