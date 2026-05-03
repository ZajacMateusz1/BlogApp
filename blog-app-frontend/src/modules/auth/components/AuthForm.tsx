import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/components/Button";
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
      className="mx-auto max-w-lg shadow p-2 flex flex-col items-center gap-2"
      {...props}
    >
      <h1 className="font-semibold text-base font-header">{formTitle}</h1>
      {rootError && <h2 className="text-error">{rootError}</h2>}
      {children}
      <div className="flex justify-center gap-1 mt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
        <Button type="button" onClick={reset}>
          Reset
        </Button>
      </div>
      <Link to={bottomLink}>{bottomLinkText}</Link>
    </form>
  );
}
