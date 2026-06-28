import useAuth from "../../auth/hooks/useAuth";
import { PencilLine } from "lucide-react";

import Button from "../../shared/components/Button";
import LinkButton from "../../shared/components/LinkButton";

interface ProfileButtonProps {
  profileId: string | undefined;
}
export default function ProfileButton({ profileId }: ProfileButtonProps) {
  const { userId } = useAuth();
  const isOwner = profileId === userId;
  if (isOwner) {
    return (
      <LinkButton variant="outlined" to={"/users/edit-profile"}>
        <PencilLine /> <span>Edit Profile</span>
      </LinkButton>
    );
  }
  return <Button>Follow</Button>;
}
