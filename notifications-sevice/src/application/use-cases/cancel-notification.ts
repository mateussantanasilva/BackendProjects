import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { Injectable } from '@nestjs/common';
import { NotificationNotFound } from './errors/notification-not-found';
import { NotificationAlreadyRead } from './errors/notification-already-read';
import { NotificationIsCanceled } from './errors/notification-is-canceled';

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

    if (notification.canceledAt) throw new NotificationIsCanceled();

    notification.cancel();

    await this.notificationsRepository.save(notification);
  }
}
