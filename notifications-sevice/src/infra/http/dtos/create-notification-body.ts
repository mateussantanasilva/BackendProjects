import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Length } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class CreateNotificationBody {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: randomUUID(),
    required: true,
  })
  recipientId: string;

  @IsNotEmpty()
  @Length(5, 240)
  @ApiProperty({
    example: 'Você tem uma nova solicitação de amizade',
    required: true,
  })
  content: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'social',
    required: true,
  })
  category: string;
}
