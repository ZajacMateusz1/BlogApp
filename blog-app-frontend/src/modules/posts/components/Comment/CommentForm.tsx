import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import useToast from "../../../shared/hooks/useToast";
import { sendRequest } from "../../../../utils/http/http";
import type { MutateCommentResponseType } from "../../types/posts-types";
import {
  CommentSchema,
  type CommentSchemaType,
} from "../../schemas/posts-schema";

import Button from "../../../shared/components/Button";
import TextAreaElement from "../../../shared/components/form/TextAreaElement";

interface CommentFormProps {
  postId: string | undefined;
  token: string | null;
}

export default function CommentForm({ postId, token }: CommentFormProps) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: CommentSchemaType) =>
      sendRequest<MutateCommentResponseType>(`/api/posts/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      }),
    mutationKey: ["comments", postId],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId],
      });
      reset();
      addToast("Comment created", "success");
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });
  const submitHandler = (formData: CommentSchemaType) => {
    mutate(formData);
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col">
      <TextAreaElement
        {...register("content")}
        className="w-full"
        placeholder="Write your comment..."
        errorMessage={errors.content?.message}
      >
        Add new comment
      </TextAreaElement>
      <Button
        className="self-end flex justify-center items-center"
        type="submit"
        disabled={isSubmitting || isPending}
      >
        <Send />
        <span>Post</span>
      </Button>
    </form>
  );
}
