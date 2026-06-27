import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GeographyService } from './geography.service'
import { GeographySeedService } from './geography-seed.service'
import { RequirePermissions } from '../../core/security/roles.decorator'
import { RolesGuard } from '../../core/security/roles.guard'

@Controller('geography')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GeographyController {
  constructor(
    private geographyService: GeographyService,
    private geographySeedService: GeographySeedService,
  ) {}

  @Get('stats')
  getStats() {
    return this.geographySeedService.getStats()
  }

  @Get('states')
  findStates() {
    return this.geographyService.findStates()
  }

  @Get('cities')
  findCities(@Query('stateId') stateId: string) {
    return this.geographyService.findCitiesByState(stateId)
  }

  @Get('neighborhoods')
  findNeighborhoods(@Query('cityId') cityId: string) {
    return this.geographyService.findNeighborhoods(cityId)
  }

  @Post('neighborhoods')
  @RequirePermissions('settings:write')
  createNeighborhood(@Body() body: { cityId: string; name: string }) {
    return this.geographyService.createNeighborhood(body.cityId, body.name)
  }

  @Delete('neighborhoods/:id')
  @RequirePermissions('settings:write')
  deleteNeighborhood(@Param('id') id: string) {
    return this.geographyService.deleteNeighborhood(id)
  }

  @Get('roads')
  findRoads(@Query('neighborhoodId') neighborhoodId: string) {
    return this.geographyService.findRoads(neighborhoodId)
  }

  @Post('roads')
  @RequirePermissions('settings:write')
  createRoad(@Body() body: { neighborhoodId: string; name: string; lengthM?: number; widthM?: number }) {
    return this.geographyService.createRoad(body.neighborhoodId, body.name, body.lengthM, body.widthM)
  }

  @Post('roads/:id')
  @RequirePermissions('settings:write')
  updateRoad(@Param('id') id: string, @Body() body: { name?: string; lengthM?: number; widthM?: number; status?: string }) {
    return this.geographyService.updateRoad(id, body)
  }

  @Delete('roads/:id')
  @RequirePermissions('settings:write')
  deleteRoad(@Param('id') id: string) {
    return this.geographyService.deleteRoad(id)
  }

  @Get('team')
  findTeam(@Query('role') role?: string) {
    return this.geographyService.findTeamMembers(role)
  }
}
