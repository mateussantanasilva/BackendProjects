import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationResponse } from './create-notification-response';

export class FromRecipientResponse {
  @ApiProperty({
    type: [CreateNotificationResponse],
  })
  notifications: [];
}
