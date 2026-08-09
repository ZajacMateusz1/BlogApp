import Notification from "../../models/notification-model.js";
import type { CreateNotificationDataType } from "./notification-types.js";
import type { PopulatedNotificationType } from "./notification-types.js";

export const getNotificationsRepository = async (
  recipient: string,
  cursor: string | undefined,
  limit: number,
) => {
  const filters = cursor
    ? { recipient: recipient, _id: { $lt: cursor } }
    : { recipient: recipient };
  const notifications = await Notification.find(filters)
    .sort({ _id: -1 })
    .limit(limit)
    .select("-__v")
    .populate("actor", "username avatarPath")
    .lean<PopulatedNotificationType[]>();
  return notifications;
};

export const markAsReadRepository = (recipient: string) => {
  return Notification.updateMany(
    { recipient: recipient, isRead: false },
    { $set: { isRead: true } },
  );
};

// send notification

export const addNotification = async (
  notificationData: CreateNotificationDataType,
) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};
