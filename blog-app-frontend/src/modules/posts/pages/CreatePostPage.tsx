import PostForm from "../components/PostForm/PostForm";

export default function CreatePostPage() {
  return (
    <PostForm
      requestLink="/api/posts/create"
      submitButtonText="Create post"
      formTitle="Create new post"
    />
  );
}
