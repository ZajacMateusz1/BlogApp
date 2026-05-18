import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";

import { PostSchema, type PostSchemaType } from "../schemas/posts-schema";
import type { AddPostResponseType } from "../types/posts-types";
import { sendRequest, queryClient } from "../../../utils/http";

import PostForm from "../components/PostForm";
import InputElement from "../../shared/components/InputElement";
import TextAreaElement from "../../shared/components/TextAreaElement";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      image: "",
      description: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: PostSchemaType) =>
      sendRequest<AddPostResponseType>(
        "http://localhost:5000/api/posts/create-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      ),
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
    mutate(formData);
  };
  return (
    <PostForm
      onSubmit={handleSubmit(submitHandler)}
      submitButtonText="Create post"
      formTitle="Create new post"
      rootError={errors.root?.message || null}
      isSubmitting={isPending || isSubmitting}
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
    </PostForm>
  );
}
