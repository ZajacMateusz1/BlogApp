import useAuth from "../../auth/hooks/useAuth";
import UserSearch from "../components/UserSearch";
import SuggestedFriends from "../components/SuggestedFriends/SuggestedFriends";
import Feed from "../components/Feed";
export default function HomePage() {
  const { token } = useAuth();
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 lg:gap-8">
      <UserSearch token={token} />
      <SuggestedFriends token={token} />
      <Feed token={token} />
    </div>
  );
}
