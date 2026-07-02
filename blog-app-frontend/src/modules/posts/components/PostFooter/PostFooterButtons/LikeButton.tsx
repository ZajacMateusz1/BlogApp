import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Heart } from "lucide-react";

import { sendRequest } from "../../../../../utils/http/http";
import type { PostResponseType } from "../../../types/posts-types";

interface LikeButtonProps {
  postId: string | undefined;
  isLiked: boolean | undefined;
  likesCount: number | undefined;
  token: string | null;
}
export default function LikeButton({
  postId,
  isLiked,
  likesCount,
  token,
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const requestMethod = isLiked ? "DELETE" : "POST";
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sendRequest(`/api/posts/${postId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: requestMethod,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      const previousPost = queryClient.getQueryData<PostResponseType>([
        "posts",
        postId,
      ]);
      queryClient.setQueryData<PostResponseType>(["posts", postId], (old) => {
        if (!old) return;
        return {
          ...old,
          isLiked: !old.isLiked,
          likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });
      return { previousPost };
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData(["posts", postId], context?.previousPost);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["posts", postId] }),
  });

  return (
    <button
      className="cursor-pointer"
      onClick={() => mutate()}
      disabled={isPending}
    >
      <Heart
        className="text-red-500"
        fill={isLiked ? "currentColor" : "none"}
      />
      <span className={isLiked ? "text-red-500" : ""}>{likesCount}</span>
    </button>
  );
}
