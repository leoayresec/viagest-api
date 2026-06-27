import { Module } from '@nestjs/common'
import { RecordsController } from './records.controller'
import { RecordsService } from './records.service'
import { PrismaModule } from '../../core/infrastructure/database/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
