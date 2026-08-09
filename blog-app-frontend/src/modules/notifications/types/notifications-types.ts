export type NotificationType = {
  id: string;
  actor: {
    id: string;
    username: string;
  };
  type: "like" | "comment" | "follow";
  post: string | undefined;
  isRead: boolean;
};

export type NotificationResponseType = {
  notifications: NotificationType[];
  nextCursor: string | undefined;
};
