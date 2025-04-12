import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationResponse {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  recipientId: string;

  @ApiProperty({
    type: String,
  })
  category: string;

  @ApiProperty({
    type: String,
  })
  content: string;
}
