import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import UserPosts from "../components/UserPosts";

export default function UserDetailsPage() {
  const { userId } = useParams();
  return (
    <>
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
    </>
  );
}
