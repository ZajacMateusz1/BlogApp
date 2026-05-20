import type { ReactNode, ComponentPropsWithoutRef } from "react";

import Button from "../../shared/components/Button";
import LinkButton from "../../shared/components/LinkButton";
import FormWrapper from "../../shared/components/FormWrapper";

interface PostFormProps extends ComponentPropsWithoutRef<"form"> {
  children: ReactNode;
  submitButtonText: string;
  isSubmitting: boolean;
  formTitle: string;
  rootError: string | null;
  cancelLink?: string;
}
export default function PostForm({
  children,
  submitButtonText,
  isSubmitting,
  formTitle,
  rootError,
  cancelLink = "/",
  ...props
}: PostFormProps) {
  return (
    <FormWrapper formTitle={formTitle} rootError={rootError} {...props}>
      {children}
      <div className="flex justify-center gap-1.5 mt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
        <LinkButton to={cancelLink} variant="outlined">
          {isSubmitting ? "Submitting..." : "Cancel"}
        </LinkButton>
      </div>
    </FormWrapper>
  );
}
