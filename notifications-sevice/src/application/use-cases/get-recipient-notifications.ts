import { Notification } from '@application/entities/notification';
import { NotificationsRepository } from '@application/repositories/notifications-respository';
import { Injectable } from '@nestjs/common';

interface GetRecipientNotificationsRequest {
  recipientId: string;
}

interface GetRecipientNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class GetRecipientNotifications {
  constructor(private notificationsRespository: NotificationsRepository) {}

  async execute(
    request: GetRecipientNotificationsRequest,
  ): Promise<GetRecipientNotificationsResponse> {
    const { recipientId } = request;

    const notifications =
      await this.notificationsRespository.findManyByRecipientId(recipientId);

    return {
      notifications,
    };
  }
}
