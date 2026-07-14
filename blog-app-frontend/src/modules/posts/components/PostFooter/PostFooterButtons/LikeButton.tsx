import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Heart } from "lucide-react";

import { sendRequest } from "../../../../../utils/http/http";
import type { PostResponseType } from "../../../types/posts-types";

interface LikeButtonProps {
  postId: string | undefined;
  creatorId?: string;
  isLiked: boolean | undefined;
  likesCount: number | undefined;
  token: string | null;
}
export default function LikeButton({
  postId,
  creatorId,
  isLiked,
  likesCount,
  token,
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const requestMethod = isLiked ? "DELETE" : "POST";
  const queryKeyId = creatorId ?? postId;
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sendRequest(`/api/posts/${postId}/like`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: requestMethod,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", queryKeyId] });
      const previousPost = queryClient.getQueryData<PostResponseType>([
        "posts",
        queryKeyId,
      ]);
      queryClient.setQueryData<PostResponseType>(
        ["posts", queryKeyId],
        (old) => {
          if (!old) return;
          return {
            ...old,
            isLiked: !old.isLiked,
            likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
          };
        },
      );
      return { previousPost };
    },
    onError: (_error, _data, context) => {
      queryClient.setQueryData(["posts", queryKeyId], context?.previousPost);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["posts", queryKeyId] }),
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
