import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "../schemas/auth-schema";
import AuthForm from "../components/AuthForm";
import InputElement from "../../shared/components/InputElement";
export default function LoginPage() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: LoginSchemaType) => {
    console.log(data);
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        submitButtonText="Log in"
        bottomLink="/register"
        bottomLinkText="Don’t have an account? Register"
      >
        <InputElement
          {...register("email")}
          errorMessage={errors.email?.message}
          type="email"
        >
          Email
        </InputElement>
        <InputElement
          {...register("password")}
          errorMessage={errors.password?.message}
          type="password"
        >
          Password
        </InputElement>
      </AuthForm>
    </div>
  );
}
