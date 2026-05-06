import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/components/Button";
import ErrorBlock from "../../shared/components/ErrorBlock";
interface AuthFormProps extends ComponentPropsWithoutRef<"form"> {
  children: ReactNode;
  isSubmitting: boolean;
  reset: () => void;
  submitButtonText: string;
  bottomLink: string;
  bottomLinkText: string;
  formTitle: string;
  rootError: string | null;
}
export default function AuthForm({
  children,
  isSubmitting,
  reset,
  submitButtonText,
  bottomLink,
  bottomLinkText,
  formTitle,
  rootError,
  ...props
}: AuthFormProps) {
  return (
    <form
      className="mx-auto max-w-xl text-center shadow p-2 flex flex-col gap-2 md:p-3 xl:p-4"
      {...props}
    >
      <h1 className="font-semibold text-lg font-header sm:text-xl md:text-2xl xl:text-3xl">
        {formTitle}
      </h1>
      {rootError && <ErrorBlock>{rootError}</ErrorBlock>}
      {children}
      <div className="flex justify-center gap-1 mt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
        <Button type="button" onClick={() => reset()} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Reset"}
        </Button>
      </div>
      <Link
        className="text-link xs:text-sm sm:text-base md:text-lg xl:text-xl"
        to={bottomLink}
      >
        {bottomLinkText}
      </Link>
    </form>
  );
}
