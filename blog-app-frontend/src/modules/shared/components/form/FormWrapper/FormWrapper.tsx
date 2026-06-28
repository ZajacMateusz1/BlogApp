import type { ReactNode, ComponentPropsWithoutRef } from "react";

import ErrorBlock from "../../ErrorBlock";

interface FormWrapperProps extends ComponentPropsWithoutRef<"form"> {
  children: ReactNode;
  formTitle: string;
  rootError: string | null;
}
export default function FormWrapper({
  children,
  formTitle,
  rootError,
  ...props
}: FormWrapperProps) {
  return (
    <form
      className="mx-auto xs:w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl text-center rounded-md shadow p-4 flex flex-col gap-3 md:p-6 xl:p-4 bg-light md:gap-4 lg:gap-6"
      {...props}
    >
      <h1 className="font-semibold text-lg font-header sm:text-xl md:text-2xl xl:text-3xl">
        {formTitle}
      </h1>
      {rootError && <ErrorBlock>{rootError}</ErrorBlock>}
      {children}
    </form>
  );
}
