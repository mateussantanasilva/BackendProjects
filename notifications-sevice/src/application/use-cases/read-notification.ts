import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { NotificationNotFound } from './errors/notification-not-found';
import { Injectable } from '@nestjs/common';
import { NotificationAlreadyRead } from './errors/notification-already-read';
import { NotificationIsCanceled } from './errors/notification-is-canceled';

interface ReadNotificationRequest {
  notificationId: string;
}

@Injectable()
export class ReadNotification {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(request: ReadNotificationRequest): Promise<void> {
    const { notificationId } = request;

    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) throw new NotificationNotFound();

    if (notification.canceledAt) throw new NotificationIsCanceled();

    if (notification.readAt) throw new NotificationAlreadyRead();

    notification.read();

    await this.notificationsRepository.save(notification);
  }
}
