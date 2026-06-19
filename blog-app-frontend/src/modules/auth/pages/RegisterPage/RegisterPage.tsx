import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { sendRequest } from "../../../../utils/http";
import AuthForm from "../../components/AuthForm/AuthForm";
import InputElement from "../../../shared/components/form/InputElement";

import {
  RegisterSchema,
  type RegisterSchemaType,
} from "../../schemas/auth-schema";
import type { AuthResponseType } from "../../types/auth-types";

export default function RegisterPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
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
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: RegisterSchemaType) =>
      sendRequest<AuthResponseType>("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }),
    onSuccess: (formData) => {
      handleLogin(formData.token, formData.id);
      navigate("/");
    },
    onError(error) {
      setError("root", {
        type: "server",
        message: error.message,
      });
    },
  });
  const submitHandler = (formData: RegisterSchemaType) => {
    mutate(formData);
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit(submitHandler)}
        isSubmitting={isSubmitting || isPending}
        reset={reset}
        formTitle="Create your account"
        submitButtonText="Register"
        bottomLink="/login"
        bottomLinkText="Already have an account? Log in"
        rootError={errors.root?.message || null}
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
          Username
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
