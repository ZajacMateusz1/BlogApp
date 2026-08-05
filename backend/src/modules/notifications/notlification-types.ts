type BaseNotificationType = {
  type: "like" | "comment" | "follow";
  post: string | undefined;
  isRead: boolean;
};
export type CreateNotificationDataType = BaseNotificationType & {
  recipient: string;
  actor: string;
};

export type SendNotificationDataType = BaseNotificationType & {
  actor: {
    id: string;
    username: string;
  };
};

export type NotificationDataType = SendNotificationDataType & {
  recipient: string;
};
