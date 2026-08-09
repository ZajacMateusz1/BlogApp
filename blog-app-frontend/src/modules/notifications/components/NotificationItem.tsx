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
    <li
      className={`${notification.isRead ? "bg-light" : "bg-not-read"} border border-primary rounded-lg`}
    >
      <Link
        className="flex items-center gap-2 md:gap-4 lg:gap-6 size-full p-2 md:p-3 lg:p-4 hover:underline transition"
        to={link}
      >
        <div className="flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18">
          <img
            className="size-full rounded-full"
            src={notification.actor.avatar}
            alt={notification.actor.username}
          />
        </div>
        <p>{text}</p>
      </Link>
    </li>
  );
}
