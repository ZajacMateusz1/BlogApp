import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../shared/components/Button";
interface AuthFormProps extends ComponentPropsWithoutRef<"form"> {
  children: ReactNode;
  submitButtonText: string;
  bottomLink: string;
  bottomLinkText: string;
  isSubmitting: boolean;
}
export default function AuthForm({
  children,
  submitButtonText,
  bottomLink,
  bottomLinkText,
  isSubmitting,
  ...props
}: AuthFormProps) {
  return (
    <form className="mx-auto max-w-lg shadow p-2" {...props}>
      {children}
      <Button type="submit">
        {isSubmitting ? "Submitting..." : submitButtonText}
      </Button>
      <Button type="reset">Reset</Button>
      <Link to={bottomLink}>{bottomLinkText}</Link>
    </form>
  );
}
