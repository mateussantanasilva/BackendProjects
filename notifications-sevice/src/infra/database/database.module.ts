import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { NotificationsRepository } from 'src/application/repositories/notifications-respository';
import { PrismaNotificationsRespository } from './prisma/repositories/prisma-notifications-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: NotificationsRepository, // sempre que uma classe precisar desse provider
      useClass: PrismaNotificationsRespository, // devolverá essa classe
    },
  ],
  exports: [NotificationsRepository], // providers para serem compartilhados
})
export class DatabaseModule {}
