"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/infrastructure/database/prisma.service");
let RecordsService = class RecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, userId) {
        return this.prisma.serviceRecord.create({
            data: {
                date: new Date(dto.date),
                neighborhood: dto.neighborhood,
                road: dto.road,
                serviceType: dto.serviceType,
                supervisor: dto.supervisor,
                recorder: dto.recorder,
                data: dto.data,
                userId,
            },
        });
    }
    async createBatch(batch, userId) {
        if (!batch.records || batch.records.length === 0) {
            throw new common_1.BadRequestException('Nenhum registro para salvar.');
        }
        const data = batch.records.map((r) => ({
            date: new Date(r.date),
            neighborhood: r.neighborhood,
            road: r.road,
            serviceType: r.serviceType,
            supervisor: r.supervisor,
            recorder: r.recorder,
            data: r.data,
            userId,
        }));
        const result = await this.prisma.serviceRecord.createMany({ data });
        return { count: result.count };
    }
    async findAll(query) {
        const where = {};
        if (query.date) {
            const d = new Date(query.date);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            where.date = { gte: d, lt: next };
        }
        else if (query.start || query.end) {
            where.date = {};
            if (query.start)
                where.date.gte = new Date(query.start);
            if (query.end) {
                const end = new Date(query.end);
                end.setDate(end.getDate() + 1);
                where.date.lt = end;
            }
        }
        if (query.neighborhood)
            where.neighborhood = query.neighborhood;
        if (query.road)
            where.road = query.road;
        if (query.recorder)
            where.recorder = query.recorder;
        return this.prisma.serviceRecord.findMany({
            where,
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
            include: { user: { select: { id: true, name: true } } },
        });
    }
    async findOne(id) {
        const record = await this.prisma.serviceRecord.findUnique({
            where: { id },
            include: { user: { select: { id: true, name: true } } },
        });
        if (!record)
            throw new common_1.NotFoundException('Registro não encontrado.');
        return record;
    }
    async remove(id) {
        const record = await this.prisma.serviceRecord.findUnique({ where: { id } });
        if (!record)
            throw new common_1.NotFoundException('Registro não encontrado.');
        await this.prisma.serviceRecord.delete({ where: { id } });
        return { message: 'Registro excluído.' };
    }
    async removeBatch(ids) {
        const result = await this.prisma.serviceRecord.deleteMany({
            where: { id: { in: ids } },
        });
        return { count: result.count };
    }
};
exports.RecordsService = RecordsService;
exports.RecordsService = RecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecordsService);
//# sourceMappingURL=records.service.js.map