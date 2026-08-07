import Notification from "../../models/notification-model.js";
import type { CreateNotificationDataType } from "./notlification-types.js";
import type { PopulatedNotificationType } from "./notlification-types.js";

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

// send notification

export const addNotification = async (
  notificationData: CreateNotificationDataType,
) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};
