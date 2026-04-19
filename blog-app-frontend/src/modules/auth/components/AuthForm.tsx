import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button";
interface AuthFormProps extends ComponentPropsWithoutRef<"form"> {
  children: ReactNode;
  submitButtonText: string;
  bottomLink: string;
  bottomLinkText: string;
}
export default function AuthForm({
  children,
  submitButtonText,
  bottomLink,
  bottomLinkText,
  ...props
}: AuthFormProps) {
  return (
    <form {...props}>
      {children}
      <Button type="submit">{submitButtonText}</Button>
      <Button type="reset">Reset</Button>
      <Link to={bottomLink}>{bottomLinkText}</Link>
    </form>
  );
}
