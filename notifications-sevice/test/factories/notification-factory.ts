import { Content } from '@application/entities/content';
import {
  Notification,
  NotificationProps,
} from '@application/entities/notification';

// todas são opicionais
type Override = Partial<NotificationProps>;

export function makeNotification(override: Override = {}) {
  const notification = new Notification({
    content: new Content('This is a new notification'),
    category: 'social',
    recipientId: 'recipient-1',
    ...override,
  });

  return notification;
}
