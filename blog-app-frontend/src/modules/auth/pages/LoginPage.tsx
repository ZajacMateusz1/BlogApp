import AuthForm from "../components/AuthForm";
import InputElement from "../../../shared/InputElement";
export default function LoginPage() {
  return (
    <div>
      <AuthForm
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
