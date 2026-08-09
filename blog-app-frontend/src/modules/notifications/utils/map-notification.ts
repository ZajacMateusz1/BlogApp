import type {
  NotificationType,
  WSNotificationType,
} from "../../notifications/types/notifications-types";
const mapNotification = (
  notification: NotificationType | WSNotificationType,
) => {
  switch (notification.type) {
    case "like":
      return {
        text: `${notification.actor.username} liked your post`,
        link: `/posts/${notification.post}`,
      };
    case "comment":
      return {
        text: `${notification.actor.username} commented on your post`,
        link: `/posts/${notification.post}`,
      };
    case "follow":
      return {
        text: `${notification.actor.username} started following you`,
        link: `/users/${notification.actor.id}`,
      };
  }
};

export default mapNotification;
