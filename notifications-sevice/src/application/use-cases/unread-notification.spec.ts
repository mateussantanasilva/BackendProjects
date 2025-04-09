import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { NotificationNotFound } from './errors/notification-not-found';
import { makeNotification } from '@test/factories/notification-factory';
import { UnreadNotification } from './unread-notification';
import { NotificationIsCanceled } from './errors/notification-is-canceled';
import { NotificationNotReadYet } from './errors/notification-not-read-yet';

describe('Use-cases: unread notification', () => {
  it('should be able to unread a notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationsRepository);

    const notification = makeNotification({ readAt: new Date() });

    await notificationsRepository.create(notification);

    await unreadNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationsRepository.notifications[0].readAt).toBeNull();
  });

  it('should not be able to unread a non existing notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationsRespository);

    await expect(
      unreadNotification.execute({
        notificationId: 'fake-notification-id',
      }),
    ).rejects.toThrow(NotificationNotFound);
  });

  it('should not be able to unread a canceled notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationsRespository);

    const notification = makeNotification({ canceledAt: new Date() });

    await notificationsRespository.create(notification);

    await expect(
      unreadNotification.execute({ notificationId: notification.id }),
    ).rejects.toThrow(NotificationIsCanceled);
  });

  it('Should not be able to mark an unread notification as unread', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const unreadNotification = new UnreadNotification(notificationsRespository);

    const notification = makeNotification();

    await notificationsRespository.create(notification);

    await expect(
      unreadNotification.execute({ notificationId: notification.id }),
    ).rejects.toThrow(NotificationNotReadYet);
  });
});
