import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { NotificationNotFound } from './errors/notification-not-found';
import { makeNotification } from '@test/factories/notification-factory';
import { ReadNotification } from './read-notification';
import { NotificationIsCanceled } from './errors/notification-is-canceled';
import { NotificationAlreadyRead } from './errors/notification-already-read';

describe('Use-cases: read notification', () => {
  it('should be able to read a notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationsRepository);

    const notification = makeNotification();

    await notificationsRepository.create(notification);

    await readNotification.execute({
      notificationId: notification.id,
    });

    expect(notificationsRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to read a non existing notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationsRespository);

    await expect(
      readNotification.execute({
        notificationId: 'fake-notification-id',
      }),
    ).rejects.toThrow(NotificationNotFound);
  });

  it('should not be able to read a canceled notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationsRespository);

    const notification = makeNotification({ canceledAt: new Date() });

    await notificationsRespository.create(notification);

    await expect(
      readNotification.execute({ notificationId: notification.id }),
    ).rejects.toThrow(NotificationIsCanceled);
  });

  it('should not be able to read an already read notification', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const readNotification = new ReadNotification(notificationsRespository);

    const notification = makeNotification({ readAt: new Date() });

    await notificationsRespository.create(notification);

    await expect(
      readNotification.execute({ notificationId: notification.id }),
    ).rejects.toThrow(NotificationAlreadyRead);
  });
});
