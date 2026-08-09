import { addNotification } from "./notification-repository.js";
import { sendMessage } from "../ws/ws.js";
import type {
  NotificationDataType,
  SendNotificationDataType,
} from "./notification-types.js";

import {
  getNotificationsRepository,
  markAsReadRepository,
} from "./notification-repository.js";

import { getPublicUrl } from "../../utils/supabaseHelpers.js";

export const getNotificationsService = async (
  recipient: string,
  cursor: string | undefined,
  limit: number,
) => {
  const notifications = await getNotificationsRepository(
    recipient,
    cursor,
    limit,
  );
  const nextCursor = notifications?.at(-1)?._id;
  return {
    notifications: notifications.map(
      ({ _id, actor, recipient, ...notification }) => {
        const { _id: actorId, username, avatarPath } = actor;
        return {
          id: _id,
          actor: {
            id: actorId,
            username: username,
            avatarPath: getPublicUrl(avatarPath),
          },
          ...notification,
        };
      },
    ),
    nextCursor,
  };
};

export const markAsReadService = async (recipient: string) => {
  await markAsReadRepository(recipient);
};

// Send Notification

export const sendNotificationService = async (
  messageData: NotificationDataType,
) => {
  const { recipient, actor, ...messageDetails } = messageData;
  const createNotificationData = {
    recipient: recipient,
    actor: actor.id,
    ...messageDetails,
  };
  await addNotification(createNotificationData);
  sendMessage<SendNotificationDataType>(recipient, {
    type: "notification",
    payload: {
      actor: {
        id: actor.id,
        username: actor.username,
      },
      ...messageDetails,
    },
  });
};
