import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { NotificationNotFound } from './errors/notification-not-found';
import { Injectable } from '@nestjs/common';
import { NotificationIsCanceled } from './errors/notification-is-canceled';
import { NotificationNotReadYet } from './errors/notification-not-read-yet';

interface UnreadNotificationRequest {
  notificationId: string;
}

@Injectable()
export class UnreadNotification {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(request: UnreadNotificationRequest): Promise<void> {
    const { notificationId } = request;

    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) throw new NotificationNotFound();

    if (notification.canceledAt) throw new NotificationIsCanceled();

    if (!notification.readAt) throw new NotificationNotReadYet();

    notification.unread();

    await this.notificationsRepository.save(notification);
  }
}
