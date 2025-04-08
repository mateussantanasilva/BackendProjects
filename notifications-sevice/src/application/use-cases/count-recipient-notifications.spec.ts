import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { CountRecipientNotifications } from './count-recipient-notifications';
import { makeNotification } from '@test/factories/notification-factory';

describe('Use-cases: count recipient notifications', () => {
  it('should be able to count notifications by recipient', async () => {
    const notificationsRespository = new InMemoryNotificationsRepository();
    const countRecipientNotifications = new CountRecipientNotifications(
      notificationsRespository,
    );

    await notificationsRespository.create(
      makeNotification({ recipientId: 'recipient-1' }),
    );
    await notificationsRespository.create(
      makeNotification({ recipientId: 'recipient-1' }),
    );
    await notificationsRespository.create(
      makeNotification({ recipientId: 'recipient-2' }),
    );

    const { count } = await countRecipientNotifications.execute({
      recipientId: 'recipient-1',
    });

    expect(count).toEqual(2);
  });
});
