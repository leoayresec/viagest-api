import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './core/infrastructure/database/prisma.module';
import { SecurityModule } from './core/security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RecordsModule } from './modules/records/records.module';
import { GeographyModule } from './modules/geography/geography.module';

@Module({
  imports: [PrismaModule, SecurityModule, AuthModule, UsersModule, RecordsModule, GeographyModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    },
  ],
})
export class AppModule {}
