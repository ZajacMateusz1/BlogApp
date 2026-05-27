import type { ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";

import { PostSchema, type PostSchemaType } from "../schemas/posts-schema";
import type {
  PostResponseType,
  MutatePostResponseType,
} from "../types/posts-types";
import { sendRequest, queryClient } from "../../../utils/http";

import Button from "../../shared/components/Button";
import LinkButton from "../../shared/components/LinkButton";
import FormWrapper from "../../shared/components/form/FormWrapper";
import InputElement from "../../shared/components/form/InputElement";
import TextAreaElement from "../../shared/components/form/TextAreaElement";

interface PostFormProps extends ComponentPropsWithoutRef<"form"> {
  postData?: PostResponseType;
  addToast?: () => void;
  requestLink: string;
  submitButtonText: string;
  formTitle: string;
  cancelLink?: string;
}
export default function PostForm({
  postData,
  requestLink,
  submitButtonText,
  formTitle,
  cancelLink = "/",
  ...props
}: PostFormProps) {
  const navigate = useNavigate();
  const { token } = useAuth();

  const requestMethod = postData ? "PATCH" : "POST";

  const {
    register,
    formState: { errors, isSubmitting, isDirty },
    handleSubmit,
    setError,
  } = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    mode: "onBlur",
    defaultValues: postData
      ? {
          title: postData.title,
          image: postData.image,
          description: postData.description,
        }
      : {
          title: "",
          image: undefined,
          description: "",
        },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: Partial<PostSchemaType>) =>
      sendRequest<MutatePostResponseType>(requestLink, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      navigate(`/posts/${data.id}`);
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });
  const submitHandler = (formData: PostSchemaType) => {
    if (postData) {
      if (!isDirty) {
        setError("root", { message: "You must provide changes!" });
        return;
      }
      const changedData = (
        Object.keys(formData) as (keyof PostSchemaType)[]
      ).reduce((changes, key) => {
        if (formData[key] !== postData?.[key]) {
          changes[key] = formData[key];
        }
        return changes;
      }, {} as Partial<PostSchemaType>);
      if (Object.keys(changedData).length < 1) return;
      mutate(changedData);
    } else {
      mutate(formData);
    }
  };
  return (
    <FormWrapper
      onSubmit={handleSubmit(submitHandler)}
      formTitle={formTitle}
      rootError={errors.root?.message || null}
      {...props}
    >
      <InputElement {...register("title")} errorMessage={errors.title?.message}>
        Title
      </InputElement>
      <InputElement {...register("image")} errorMessage={errors.image?.message}>
        Image
      </InputElement>
      <TextAreaElement
        {...register("description")}
        errorMessage={errors.description?.message}
      >
        Description
      </TextAreaElement>
      <div className="flex justify-center gap-1.5 mt-1">
        <Button type="submit" disabled={isSubmitting || isPending}>
          {isSubmitting || isPending ? "Submitting..." : submitButtonText}
        </Button>
        <LinkButton to={cancelLink} variant="outlined">
          {isSubmitting || isPending ? "Submitting..." : "Cancel"}
        </LinkButton>
      </div>
    </FormWrapper>
  );
}
