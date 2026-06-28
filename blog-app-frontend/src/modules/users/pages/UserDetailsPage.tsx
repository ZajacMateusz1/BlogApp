import { useParams } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import UserPosts from "../components/UserPosts";

export default function UserDetailsPage() {
  const { userId } = useParams();
  return (
    <div className="max-w-3xl mx-auto">
      <UserProfile profileId={userId} />
      <UserPosts userId={userId} />
    </div>
  );
}
