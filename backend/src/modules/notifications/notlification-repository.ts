import Notification from "../../models/notification-model.js";
import type { CreateNotificationDataType } from "./notlification-types.js";

export const addNotification = async (
  notificationData: CreateNotificationDataType,
) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};
