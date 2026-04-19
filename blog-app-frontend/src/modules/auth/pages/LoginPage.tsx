import { type SubmitEvent } from "react";
import AuthForm from "../components/AuthForm";
import InputElement from "../../../shared/components/InputElement";
export default function LoginPage() {
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit}
        submitButtonText="Log in"
        bottomLink="/register"
        bottomLinkText="Don’t have an account? Register"
      >
        <InputElement name="email" type="email">
          Email
        </InputElement>
        <InputElement name="password" type="password">
          Password
        </InputElement>
      </AuthForm>
    </div>
  );
}
