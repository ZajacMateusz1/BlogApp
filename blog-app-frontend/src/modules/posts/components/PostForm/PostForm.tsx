import type { ComponentPropsWithoutRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../auth/hooks/useAuth";

import {
  CreatePostSchema,
  EditPostSchema,
  type CreatePostSchemaType,
  type EditPostSchemaType,
} from "../../schemas/posts-schema";
import type {
  PostResponseType,
  MutatePostResponseType,
} from "../../types/posts-types";
import { sendRequest } from "../../../../utils/http";

import Button from "../../../shared/components/Button";
import LinkButton from "../../../shared/components/LinkButton";
import FormWrapper from "../../../shared/components/form/FormWrapper/FormWrapper";
import InputElement from "../../../shared/components/form/InputElement";
import TextAreaElement from "../../../shared/components/form/TextAreaElement";
import ImageUpload from "../../../shared/components/form/ImageUpload";

interface PostFormProps extends ComponentPropsWithoutRef<"form"> {
  postData?: PostResponseType;
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
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const requestMethod = postData ? "PATCH" : "POST";

  const {
    register,
    formState: { errors, isSubmitting, isDirty },
    handleSubmit,
    setError,
    control,
  } = useForm<CreatePostSchemaType | EditPostSchemaType>({
    resolver: zodResolver(postData ? EditPostSchema : CreatePostSchema),
    mode: "onBlur",
    defaultValues: postData
      ? {
          title: postData.title,
          image: undefined,
          description: postData.description,
        }
      : {
          title: "",
          image: undefined,
          description: "",
        },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      sendRequest<MutatePostResponseType>(requestLink, {
        method: requestMethod,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
  const submitHandler = (
    newPostData: CreatePostSchemaType | EditPostSchemaType,
  ) => {
    const formData = new FormData();
    if (postData) {
      if (!isDirty) {
        setError("root", { message: "You must provide changes!" });
        return;
      }
      if (postData.title !== newPostData.title)
        formData.append("title", newPostData.title);
      if (postData.description !== newPostData.description)
        formData.append("description", newPostData.description);
    } else {
      formData.append("title", newPostData.title);
      formData.append("description", newPostData.description);
    }
    if (newPostData.image) formData.append("image", newPostData.image);
    mutate(formData);
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
      <TextAreaElement
        {...register("description")}
        errorMessage={errors.description?.message}
      >
        Description
      </TextAreaElement>
      <Controller
        name="image"
        control={control}
        render={({
          field: { onChange, name, value },
          fieldState: { error },
        }) => (
          <ImageUpload
            name={name}
            errorMessage={error?.message}
            changeValue={onChange}
            imageValue={value}
            accept=".jpg,.jpeg,.png"
          >
            Pick Image
          </ImageUpload>
        )}
      />
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
