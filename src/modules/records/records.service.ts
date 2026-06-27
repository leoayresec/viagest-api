import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'
import { CreateRecordDto } from './dto/create-record.dto'
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto'

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRecordDto, userId?: string) {
    let recorderId = dto.recorderId
    if (!recorderId && dto.recorderName) {
      const user = await this.prisma.user.findFirst({
        where: { name: dto.recorderName, role: { name: 'apontador' } },
      })
      recorderId = user?.id
    }

    return this.prisma.serviceRecord.create({
      data: {
        date: new Date(dto.date),
        roadId: dto.roadId,
        serviceType: dto.serviceType as any,
        supervisorId: dto.supervisorId,
        recorderId,
        data: dto.data,
        userId,
      },
      include: {
        road: { include: { neighborhood: { include: { city: { include: { state: true } } } } } },
        supervisor: true,
        recorder: true,
      },
    })
  }

  async createBatch(batch: CreateRecordsBatchDto, userId?: string) {
    if (!batch.records || batch.records.length === 0) {
      throw new BadRequestException('Nenhum registro para salvar.')
    }

    const resolvedRecords = await Promise.all(
      batch.records.map(async (r) => {
        let recorderId = r.recorderId
        if (!recorderId && r.recorderName) {
          const user = await this.prisma.user.findFirst({
            where: { name: r.recorderName, role: { name: 'apontador' } },
          })
          recorderId = user?.id
        }
        return { ...r, recorderId }
      }),
    )

    const data = resolvedRecords.map((r) => ({
      date: new Date(r.date),
      roadId: r.roadId,
      serviceType: r.serviceType as any,
      supervisorId: r.supervisorId,
      recorderId: r.recorderId,
      data: r.data,
      userId,
    }))

    const result = await this.prisma.serviceRecord.createMany({ data })
    return { count: result.count }
  }

  async findAll(query: { date?: string; start?: string; end?: string; roadId?: string; recorderId?: string }) {
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

    if (query.roadId) where.roadId = query.roadId
    if (query.recorderId) where.recorderId = query.recorderId

    return this.prisma.serviceRecord.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      include: {
        road: { include: { neighborhood: { include: { city: { include: { state: true } } } } } },
        supervisor: true,
        recorder: true,
        user: { select: { id: true, name: true } },
      },
    })
  }

  async findOne(id: string) {
    const record = await this.prisma.serviceRecord.findUnique({
      where: { id },
      include: {
        road: { include: { neighborhood: { include: { city: { include: { state: true } } } } } },
        supervisor: true,
        recorder: true,
        user: { select: { id: true, name: true } },
      },
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
