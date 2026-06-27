import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'
import { CreateRecordDto } from './dto/create-record.dto'
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto'

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRecordDto, userId?: string) {
    return this.prisma.serviceRecord.create({
      data: {
        date: new Date(dto.date),
        neighborhood: dto.neighborhood,
        road: dto.road,
        serviceType: dto.serviceType as any,
        supervisor: dto.supervisor,
        recorder: dto.recorder,
        data: dto.data,
        userId,
      },
    })
  }

  async createBatch(batch: CreateRecordsBatchDto, userId?: string) {
    if (!batch.records || batch.records.length === 0) {
      throw new BadRequestException('Nenhum registro para salvar.')
    }

    const data = batch.records.map((r) => ({
      date: new Date(r.date),
      neighborhood: r.neighborhood,
      road: r.road,
      serviceType: r.serviceType as any,
      supervisor: r.supervisor,
      recorder: r.recorder,
      data: r.data,
      userId,
    }))

    const result = await this.prisma.serviceRecord.createMany({ data })
    return { count: result.count }
  }

  async findAll(query: { date?: string; start?: string; end?: string; neighborhood?: string; road?: string; recorder?: string }) {
    const where: any = {}

    if (query.date) {
      const d = new Date(query.date)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      where.date = { gte: d, lt: next }
    } else if (query.start || query.end) {
      where.date = {}
      if (query.start) where.date.gte = new Date(query.start)
      if (query.end) {
        const end = new Date(query.end)
        end.setDate(end.getDate() + 1)
        where.date.lt = end
      }
    }

    if (query.neighborhood) where.neighborhood = query.neighborhood
    if (query.road) where.road = query.road
    if (query.recorder) where.recorder = query.recorder

    return this.prisma.serviceRecord.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: { user: { select: { id: true, name: true } } },
    })
  }

  async findOne(id: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true } } },
    })
    if (!record) throw new NotFoundException('Registro não encontrado.')
    return record
  }

  async remove(id: string) {
    const record = await this.prisma.serviceRecord.findUnique({ where: { id } })
    if (!record) throw new NotFoundException('Registro não encontrado.')
    await this.prisma.serviceRecord.delete({ where: { id } })
    return { message: 'Registro excluído.' }
  }

  async removeBatch(ids: string[]) {
    const result = await this.prisma.serviceRecord.deleteMany({
      where: { id: { in: ids } },
    })
    return { count: result.count }
  }
}
