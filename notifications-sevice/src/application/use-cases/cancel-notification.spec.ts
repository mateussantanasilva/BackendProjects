import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { CancelNotification } from './cancel-notification';
import { NotificationNotFound } from './errors/notification-not-found';
import { makeNotification } from '@test/factories/notification-factory';
import { NotificationAlreadyRead } from './errors/notification-already-read';

describe('Use-cases: cancel notification', () => {
  it('should be able to cancel a notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const cancelNotification = new CancelNotification(notificationsRepository);

    const notification = makeNotification();

    await notificationsRepository.create(notification);

    await cancelNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationsRepository.notifications[0].canceledAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to cancel a non existing notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const cancelNotification = new CancelNotification(notificationsRespository);

    await expect(
      cancelNotification.execute({
        notificationId: 'fake-notification-id',
      }),
    ).rejects.toThrow(NotificationNotFound);
  });

  it('should not be able to cancel a read notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const cancelNotification = new CancelNotification(notificationsRespository);

    const notification = makeNotification({ readAt: new Date() });

    await notificationsRespository.create(notification);

    await expect(
      cancelNotification.execute({ notificationId: notification.id }),
    ).rejects.toThrow(NotificationAlreadyRead);
  });
});
