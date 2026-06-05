import type { UserResponseType } from "../types/users-types";
interface UserProfileProps {
  userData: UserResponseType | undefined;
}
export default function UserProfile({ userData }: UserProfileProps) {
  return (
    <section>
      <p>{userData?.id}</p>
      <p>{userData?.username}</p>
    </section>
  );
}
