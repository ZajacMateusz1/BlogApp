import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import useToast from "../../shared/hooks/useToast";
import { sendRequest } from "../../../utils/http/http";
import type { FollowResponseType } from "../types/users-types";

import Button from "../../shared/components/Button";

interface FollowButtonProps {
  isFollowing: boolean | undefined;
  followingId: string | undefined;
  invalidateQueryKey: QueryKey;
}

export default function FollowButton({
  isFollowing,
  followingId,
  invalidateQueryKey,
}: FollowButtonProps) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { addToast } = useToast();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: isFollowing ? "DELETE" : "POST",
  };
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      isFollowing
        ? sendRequest<null>(`/api/users/${followingId}/follow`, options)
        : sendRequest<FollowResponseType>(
            `/api/users/${followingId}/follow`,
            options,
          ),
    onSuccess: () => {
      addToast("Success", "success");
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });
  if (isFollowing)
    return (
      <Button onClick={() => mutate()} disabled={isPending} variant="outlined">
        {isPending ? "Sending..." : "Unfollow"}
      </Button>
    );
  return (
    <Button onClick={() => mutate()} disabled={isPending}>
      {isPending ? "Sending..." : "Follow"}
    </Button>
  );
}
