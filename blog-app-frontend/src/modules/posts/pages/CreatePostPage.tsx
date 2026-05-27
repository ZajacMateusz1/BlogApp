import PostForm from "../components/PostForm";

export default function CreatePostPage() {
  return (
    <PostForm
      requestLink="/api/posts/create-post"
      submitButtonText="Create post"
      formTitle="Create new post"
    />
  );
}
