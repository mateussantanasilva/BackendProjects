import { HttpException } from '@nestjs/common';

export class NotificationNotFound extends HttpException {
  constructor() {
    // chama o construtor do HttpException (Error)
    super('Notification not found.', 404);
  }
}
