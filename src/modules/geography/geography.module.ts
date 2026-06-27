import { Module } from '@nestjs/common'
import { GeographyController } from './geography.controller'
import { GeographyService } from './geography.service'
import { GeographySeedService } from './geography-seed.service'

@Module({
  controllers: [GeographyController],
  providers: [GeographyService, GeographySeedService],
  exports: [GeographySeedService],
})
export class GeographyModule {}
