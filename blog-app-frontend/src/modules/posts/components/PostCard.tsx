import type { PostResponseType } from "../types/posts-types";

interface PostCardInterfaceProps {
  postData: PostResponseType;
}
export default function PostCard({ postData }: PostCardInterfaceProps) {
  console.log(postData);
  return (
    <article>
      <header>
        <div className="user-data flex items-center mb-2 gap-2">
          <img
            className="w-10 h-10 rounded-lg sm:w-12 sm:h-12 md:w-14 md:h-14"
            src={postData.creator.avatar}
            alt="User avatar"
          ></img>
          <p className="font-semibold lg:text-lg">
            {postData.creator.username}
          </p>
        </div>
        <p>{postData.createdAt}</p>
      </header>
      <h3>{postData.title}</h3>
      <p className="line-clamp-3">{postData.description}</p>
      <div className="w-full">
        <img src={postData.image} alt={postData.title} />
      </div>
    </article>
  );
}
