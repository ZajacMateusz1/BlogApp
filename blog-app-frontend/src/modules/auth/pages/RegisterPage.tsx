import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../schemas/auth-schema";
import AuthForm from "../components/AuthForm";
import InputElement from "../../shared/components/InputElement";
export default function RegisterPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      repeatPassword: "",
    },
  });
  const onSubmit = (data: RegisterSchemaType) => {
    console.log(data);
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        submitButtonText="Register"
        bottomLink="/login"
        bottomLinkText="Already have an account? Log in"
      >
        <InputElement
          {...register("email")}
          errorMessage={errors.email?.message}
          type="email"
        >
          Email
        </InputElement>
        <InputElement
          {...register("username")}
          errorMessage={errors.username?.message}
          type="text"
        >
          Username:
        </InputElement>
        <InputElement
          {...register("password")}
          errorMessage={errors.password?.message}
          type="password"
        >
          Password
        </InputElement>
        <InputElement
          {...register("repeatPassword")}
          errorMessage={errors.repeatPassword?.message}
          type="password"
        >
          Repeat Password
        </InputElement>
      </AuthForm>
    </div>
  );
}
