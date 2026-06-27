import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RecordsService } from './records.service'
import { CreateRecordDto } from './dto/create-record.dto'
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto'
import { RequirePermissions } from '../../core/security/roles.decorator'
import { RolesGuard } from '../../core/security/roles.guard'
import { CurrentUser } from '../../core/security/current-user.decorator'

@Controller('records')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RecordsController {
  constructor(private recordsService: RecordsService) {}

  @Post()
  @RequirePermissions('records:create')
  create(@Body() dto: CreateRecordDto, @CurrentUser('id') userId: string) {
    return this.recordsService.create(dto, userId)
  }

  @Post('batch')
  @RequirePermissions('records:create')
  createBatch(@Body() dto: CreateRecordsBatchDto, @CurrentUser('id') userId: string) {
    return this.recordsService.createBatch(dto, userId)
  }

  @Get()
  @RequirePermissions('records:read')
  findAll(
    @Query('date') date?: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('neighborhood') neighborhood?: string,
    @Query('road') road?: string,
    @Query('recorder') recorder?: string,
  ) {
    return this.recordsService.findAll({ date, start, end, neighborhood, road, recorder })
  }

  @Get(':id')
  @RequirePermissions('records:read')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id)
  }

  @Delete(':id')
  @RequirePermissions('records:write')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id)
  }

  @Delete('batch')
  @RequirePermissions('records:write')
  removeBatch(@Body() body: { ids: string[] }) {
    return this.recordsService.removeBatch(body.ids)
  }
}
