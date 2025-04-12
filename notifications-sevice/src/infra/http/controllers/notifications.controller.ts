import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateNotificationBody } from '../dtos/create-notification-body';
import { SendNotification } from 'src/application/use-cases/send-notification';
import { NotificationViewModel } from '../view-models/notification-view-model';
import { CancelNotification } from '@application/use-cases/cancel-notification';
import { CountRecipientNotifications } from '@application/use-cases/count-recipient-notifications';
import { GetRecipientNotifications } from '@application/use-cases/get-recipient-notifications';
import { ReadNotification } from '@application/use-cases/read-notification';
import { UnreadNotification } from '@application/use-cases/unread-notification';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountFromRecipient } from '../dtos/count-from-recipient-response';
import { FromRecipientResponse } from '../dtos/from-recipient-response';
import { CreateNotificationResponse } from '../dtos/create-notification-response';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(
    private sendNotification: SendNotification,
    private cancelNotification: CancelNotification,
    private readNotification: ReadNotification,
    private unreadNotification: UnreadNotification,
    private countRecipientNotifications: CountRecipientNotifications,
    private getRecipientNotifications: GetRecipientNotifications,
  ) {}

  @Post()
  @ApiBody({ type: CreateNotificationBody })
  @ApiResponse({ status: 201, type: CreateNotificationResponse })
  async create(@Body() body: CreateNotificationBody) {
    const { recipientId, content, category } = body;

    const { notification } = await this.sendNotification.execute({
      category,
      content,
      recipientId,
    });

    return {
      notification: NotificationViewModel.toHTTP(notification),
    };
  }

  @Patch(':id/cancel')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  async cancel(@Param('id') id: string) {
    await this.cancelNotification.execute({ notificationId: id });
  }

  @Patch(':id/read')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async read(@Param('id') id: string) {
    await this.readNotification.execute({ notificationId: id });
  }

  @Patch(':id/unread')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async unread(@Param('id') id: string) {
    await this.unreadNotification.execute({ notificationId: id });
  }

  @Get('count/from/:recipientId')
  @ApiParam({ name: 'recipientId' })
  @ApiResponse({ status: 200, type: CountFromRecipient })
  async countFromRecipient(@Param('recipientId') recipientId: string) {
    const { count } = await this.countRecipientNotifications.execute({
      recipientId,
    });

    return {
      count,
    };
  }

  @Get('from/:recipientId')
  @ApiParam({ name: 'recipientId' })
  @ApiResponse({ status: 200, type: FromRecipientResponse })
  async getFromRecipient(@Param('recipientId') recipientId: string) {
    const { notifications } = await this.getRecipientNotifications.execute({
      recipientId,
    });

    return {
      notifications: notifications.map((item) =>
        NotificationViewModel.toHTTP(item),
      ),
    };
  }
}
