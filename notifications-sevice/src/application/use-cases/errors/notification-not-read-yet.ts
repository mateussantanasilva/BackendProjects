import { HttpException } from '@nestjs/common';

export class NotificationNotReadYet extends HttpException {
  constructor() {
    super('Notification not read yet.', 400);
  }
}
