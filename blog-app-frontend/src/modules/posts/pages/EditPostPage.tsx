import { useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import { PostSchema, type PostSchemaType } from "../schemas/posts-schema";
import { sendRequest, queryClient } from "../../../utils/http";
import type {
  PostResponseType,
  EditPostResponseType,
} from "../types/posts-types";

import InputElement from "../../shared/components/InputElement";
import TextAreaElement from "../../shared/components/TextAreaElement";
import ErrorBlock from "../../shared/components/ErrorBlock";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import PostForm from "../components/PostForm";

export default function EditPostPage() {
  const { postId } = useParams();
  const { userId, token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    data: oldData,
    isLoading: oldDataLoading,
    isError: oldDataIsError,
    error: oldDataError,
  } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostResponseType>(
        `http://localhost:5000/api/posts/${postId}`,
        { signal },
      ),
  });
  const {
    register,
    formState: { isDirty, isSubmitting, errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<PostSchemaType>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      image: "",
      description: "",
    },
  });
  useEffect(() => {
    reset({
      title: oldData?.title,
      image: oldData?.image,
      description: oldData?.description,
    });
  }, [oldData, reset]);
  const { mutate, isPending: editIsPending } = useMutation({
    mutationFn: (formData: Partial<PostSchemaType>) =>
      sendRequest<EditPostResponseType>(
        `http://localhost:5000/api/posts/edit/${postId}`,
        {
          method: "PATCH",
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
      addToast("Post changed", "success");
      navigate(`/posts/${data.id}`);
    },
    onError: (error) => {
      setError("root", { message: error.message });
    },
  });

  const submitHandler = (newData: PostSchemaType) => {
    if (!isDirty) setError("root", { message: "You must provide changes!" });
    const changedData = (
      Object.keys(newData) as (keyof PostSchemaType)[]
    ).reduce((changes, key) => {
      if (newData[key] !== oldData?.[key]) {
        changes[key] = newData[key];
      }
      return changes;
    }, {} as Partial<PostSchemaType>);
    if (Object.keys(changedData).length < 1) return;
    mutate(changedData);
  };

  if (oldDataIsError) return <ErrorBlock>{oldDataError.message}</ErrorBlock>;
  if (oldDataLoading) return <LoadingSpinner />;
  if (oldData?.creator.id !== userId) return <Navigate to="/" replace />;

  return (
    <PostForm
      onSubmit={handleSubmit(submitHandler)}
      formTitle="Edit post"
      submitButtonText="Edit post"
      rootError={errors.root?.message || null}
      isSubmitting={isSubmitting || editIsPending}
      cancelLink={`/posts/${postId}`}
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
