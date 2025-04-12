import { HttpException } from '@nestjs/common';

export class NotificationAlreadyRead extends HttpException {
  constructor() {
    super('Notification already read.', 400);
  }
}
