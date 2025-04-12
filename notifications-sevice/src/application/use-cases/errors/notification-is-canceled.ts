import { HttpException } from '@nestjs/common';

export class NotificationIsCanceled extends HttpException {
  constructor() {
    super('Notification is canceled.', 400);
  }
}
