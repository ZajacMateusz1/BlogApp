import { PencilLine } from "lucide-react";

import LinkButton from "../../shared/components/LinkButton";
import FollowButton from "./FollowButton";

interface ProfileButtonProps {
  profileId: string | undefined;
  userId: string | null;
  isFollowing: boolean | undefined;
}
export default function ProfileButton({
  profileId,
  userId,
  isFollowing,
}: ProfileButtonProps) {
  const isOwner = profileId === userId;
  if (isOwner) {
    return (
      <LinkButton variant="outlined" to={"/users/edit-profile"}>
        <PencilLine /> <span>Edit Profile</span>
      </LinkButton>
    );
  }
  return (
    <FollowButton
      followingId={profileId}
      isFollowing={isFollowing}
      invalidateQueryKey={["users", profileId]}
    />
  );
}
