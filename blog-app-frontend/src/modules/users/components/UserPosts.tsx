interface UserPostsProps {
  userId: string | undefined;
}
export default function UserPosts({ userId }: UserPostsProps) {
  return <section>{userId}</section>;
}
