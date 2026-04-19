import AuthForm from "../components/AuthForm";
import InputElement from "../../../shared/components/InputElement";
export default function RegisterPage() {
  return (
    <div>
      <AuthForm
        submitButtonText="Register"
        bottomLink="/login"
        bottomLinkText="Already have an account? Log in"
      >
        <InputElement name="email" type="email">
          Email
        </InputElement>
        <InputElement name="username" type="text">
          Username:
        </InputElement>
        <InputElement name="password" type="password">
          Password
        </InputElement>
        <InputElement name="repeat-password" type="password">
          Repeat Password
        </InputElement>
      </AuthForm>
    </div>
  );
}
