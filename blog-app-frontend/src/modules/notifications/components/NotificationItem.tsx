import type { NotificationType } from "../types/notifications-types";
import mapNotification from "../utils/map-notification";
import { Link } from "react-router-dom";
interface NotificationItemProps {
  notification: NotificationType;
}
export default function NotificationItem({
  notification,
}: NotificationItemProps) {
  const { text, link } = mapNotification(notification);
  return (
    <li>
      <Link to={link}>{text}</Link>
    </li>
  );
}
