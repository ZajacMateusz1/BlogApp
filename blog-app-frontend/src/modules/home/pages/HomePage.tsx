import UserSearch from "../components/UserSearch";
import SuggestedFriends from "../components/SuggestedFriends/SuggestedFriends";
export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 lg:gap-8">
      <UserSearch />
      <SuggestedFriends />
    </div>
  );
}
