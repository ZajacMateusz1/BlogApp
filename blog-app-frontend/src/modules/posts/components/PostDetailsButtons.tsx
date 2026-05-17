import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import useToast from "../../shared/hooks/useToast";

import Button from "../../shared/components/Button";

import { sendRequest, queryClient } from "../../../utils/http";

interface PostDetailsButtonsProps {
  postId: string;
  token: string;
}

export default function PostDetailsButtons({
  postId,
  token,
}: PostDetailsButtonsProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (postId: string) =>
      sendRequest<null>(`http://localhost:5000/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onError: (error) => {
      addToast(error.message, "error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      addToast("Post deleted", "success");
      navigate("/");
    },
  });

  return (
    <div>
      <Button
        onClick={() => {
          mutate(postId);
        }}
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete Post"}
      </Button>
    </div>
  );
}
