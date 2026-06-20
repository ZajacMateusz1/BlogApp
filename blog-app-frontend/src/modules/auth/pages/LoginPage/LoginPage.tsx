import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { sendRequest } from "../../../../utils/http/http";
import AuthForm from "../../components/AuthForm/AuthForm";
import InputElement from "../../../shared/components/form/InputElement";

import { LoginSchema, type LoginSchemaType } from "../../schemas/auth-schema";
import { type AuthResponseType } from "../../types/auth-types";
export default function LoginPage() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: LoginSchemaType) =>
      sendRequest<AuthResponseType>("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }),
    onSuccess: (data) => {
      handleLogin(data.token, data.id);
      navigate("/");
    },
    onError: (error) => {
      setError("root", {
        type: "server",
        message: error.message,
      });
    },
  });
  const submitHandler = (formData: LoginSchemaType) => {
    mutate(formData);
  };
  return (
    <div>
      <AuthForm
        onSubmit={handleSubmit(submitHandler)}
        isSubmitting={isSubmitting || isPending}
        reset={reset}
        formTitle="Log in to your account"
        submitButtonText="Log in"
        bottomLink="/register"
        bottomLinkText="Don’t have an account? Register"
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
