export type NotificationType = {
  actor: {
    id: string;
    username: string;
  };
  type: "like" | "comment" | "follow";
  post: string | undefined;
  isRead: boolean;
};
