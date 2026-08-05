import { addNotification } from "./notlification-repository.js";
import { sendMessage } from "../ws/ws.js";
import type {
  NotificationDataType,
  SendNotificationDataType,
} from "./notlification-types.js";

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
