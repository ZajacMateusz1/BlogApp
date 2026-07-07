import useAuth from "../../auth/hooks/useAuth";
import LinkButton from "../../shared/components/LinkButton";

interface PostsNotFoundProps {
  creatorId: string | undefined;
}

export default function PostsNotFound({ creatorId }: PostsNotFoundProps) {
  const { userId } = useAuth();
  return (
    <section className="mt-6 p-4 bg-light md:p-6 lg:p-8">
      <h2 className="font-bold uppercase text-center text-lg md:text-xl lg:text-2xl mb-6">
        No posts found.
      </h2>
      {userId === creatorId && (
        <LinkButton className="max-w-3/4 mx-auto" to="/posts/create">
          Create new
        </LinkButton>
      )}
    </section>
  );
}
