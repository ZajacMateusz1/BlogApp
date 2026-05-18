import type { ReactNode, ComponentPropsWithoutRef } from "react";

import ErrorBlock from "../../shared/components/ErrorBlock";

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
      className="mx-auto xs:w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl text-center rounded-md shadow p-2 flex flex-col gap-2 md:p-3 xl:p-4 bg-bg-header"
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
