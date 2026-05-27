import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";

import FormWrapper from "../../shared/components/form/FormWrapper";
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
    <FormWrapper formTitle={formTitle} rootError={rootError} {...props}>
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
    </FormWrapper>
  );
}
