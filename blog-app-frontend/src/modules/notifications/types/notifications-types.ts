type BaseNotificationType = {
  id: string;
  type: "like" | "comment" | "follow";
  post: string | undefined;
  isRead: boolean;
  createdAt: string;
};

export type WSNotificationType = BaseNotificationType & {
  actor: {
    id: string;
    username: string;
  };
};

export type NotificationType = WSNotificationType & {
  actor: {
    id: string;
    username: string;
    avatar: string;
  };
};

export type NotificationResponseType = {
  notifications: NotificationType[];
  nextCursor: string | undefined;
};
