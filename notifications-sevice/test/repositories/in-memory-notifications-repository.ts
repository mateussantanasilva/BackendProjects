import { Notification } from '@application/entities/notification';
import { NotificationsRepository } from '@application/repositories/notifications-respository';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = [];

  async create(notification: Notification) {
    await Promise.resolve(); // simula await assíncrono
    this.notifications.push(notification);
  }

  async findById(notificationId: string) {
    await Promise.resolve(); // simula await assíncrono

    const notification = this.notifications.find(
      (item) => item.id === notificationId,
    );

    if (!notification) return null;

    return notification;
  }

  async save(notification: Notification) {
    await Promise.resolve(); // simula await assíncrono

    const notificationIndex = this.notifications.findIndex(
      (item) => item.id === notification.id,
    );

    if (notificationIndex >= 0)
      this.notifications[notificationIndex] = notification;
  }

  async countManyByRecipientId(recipientId: string) {
    await Promise.resolve(); // simula await assíncrono

    return this.notifications.filter((item) => item.recipientId === recipientId)
      .length;
  }

  async findManyByRecipientId(recipientId: string) {
    await Promise.resolve(); // simula await assíncrono

    return this.notifications.filter(
      (item) => item.recipientId === recipientId,
    );
  }
}
