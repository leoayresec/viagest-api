import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'

@Injectable()
export class GeographyService {
  constructor(private prisma: PrismaService) {}

  async findStates() {
    return this.prisma.state.findMany({ orderBy: { name: 'asc' } })
  }

  async findCitiesByState(stateId: string) {
    return this.prisma.city.findMany({ where: { stateId }, orderBy: { name: 'asc' } })
  }

  async findNeighborhoods(cityId: string) {
    return this.prisma.neighborhood.findMany({ where: { cityId }, orderBy: { name: 'asc' } })
  }

  async createNeighborhood(cityId: string, name: string) {
    const city = await this.prisma.city.findUnique({ where: { id: cityId } })
    if (!city) throw new Error('Cidade não encontrada.')

    return this.prisma.neighborhood.upsert({
      where: { cityId_name: { cityId, name } },
      update: {},
      create: { cityId, name },
    })
  }

  async deleteNeighborhood(id: string) {
    return this.prisma.neighborhood.delete({ where: { id } })
  }

  async findRoads(neighborhoodId: string) {
    return this.prisma.road.findMany({ where: { neighborhoodId }, orderBy: { name: 'asc' } })
  }

  async createRoad(neighborhoodId: string, name: string, lengthM?: number, widthM?: number) {
    const neighborhood = await this.prisma.neighborhood.findUnique({ where: { id: neighborhoodId } })
    if (!neighborhood) throw new Error('Bairro não encontrado.')

    return this.prisma.road.upsert({
      where: { neighborhoodId_name: { neighborhoodId, name } },
      update: { lengthM: lengthM ?? 0, widthM: widthM ?? 0 },
      create: { neighborhoodId, name, lengthM: lengthM ?? 0, widthM: widthM ?? 0 },
    })
  }

  async updateRoad(id: string, data: { name?: string; lengthM?: number; widthM?: number; status?: string }) {
    return this.prisma.road.update({ where: { id }, data })
  }

  async deleteRoad(id: string) {
    return this.prisma.road.delete({ where: { id } })
  }

  async findTeamMembers(role?: string) {
    const where = role ? { role: { name: role } } : {}
    return this.prisma.user.findMany({
      where,
      select: { id: true, name: true, role: { select: { name: true } } },
      orderBy: { name: 'asc' },
    })
  }
}
