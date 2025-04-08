import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { NotificationNotFound } from './errors/notification-not-found';
import { Injectable } from '@nestjs/common';

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

    notification.unread();

    await this.notificationsRepository.save(notification);
  }
}
