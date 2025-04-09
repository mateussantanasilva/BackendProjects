import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { Injectable } from '@nestjs/common';
import { NotificationNotFound } from './errors/notification-not-found';
import { NotificationAlreadyRead } from './errors/notification-already-read';

interface CancelNotificationRequest {
  notificationId: string;
}

@Injectable()
export class CancelNotification {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(request: CancelNotificationRequest): Promise<void> {
    const { notificationId } = request;

    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) throw new NotificationNotFound();

    if (notification.readAt) throw new NotificationAlreadyRead();

    notification.cancel();

    await this.notificationsRepository.save(notification);
  }
}
