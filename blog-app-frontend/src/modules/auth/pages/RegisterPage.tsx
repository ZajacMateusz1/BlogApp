import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../schemas/auth-schema";
import type { APIErrorType } from "../../shared/types/api-error-types";
import AuthForm from "../components/AuthForm";
import InputElement from "../../shared/components/InputElement";
export default function RegisterPage() {
  const {
    register,
    formState: { errors, isSubmitting },
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
  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        const error = responseData as APIErrorType;
        throw new Error(error.message);
      }
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
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
