import { ApiProperty } from '@nestjs/swagger';

export class CountFromRecipient {
  @ApiProperty({
    type: Number,
  })
  count: number;
}
