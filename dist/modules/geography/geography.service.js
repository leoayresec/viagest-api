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
exports.GeographyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/infrastructure/database/prisma.service");
let GeographyService = class GeographyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findStates() {
        return this.prisma.state.findMany({ orderBy: { name: 'asc' } });
    }
    async findCitiesByState(stateId) {
        return this.prisma.city.findMany({ where: { stateId }, orderBy: { name: 'asc' } });
    }
    async findNeighborhoods(cityId) {
        return this.prisma.neighborhood.findMany({ where: { cityId }, orderBy: { name: 'asc' } });
    }
    async createNeighborhood(cityId, name) {
        const city = await this.prisma.city.findUnique({ where: { id: cityId } });
        if (!city)
            throw new Error('Cidade não encontrada.');
        return this.prisma.neighborhood.upsert({
            where: { cityId_name: { cityId, name } },
            update: {},
            create: { cityId, name },
        });
    }
    async deleteNeighborhood(id) {
        return this.prisma.neighborhood.delete({ where: { id } });
    }
    async findRoads(neighborhoodId) {
        return this.prisma.road.findMany({ where: { neighborhoodId }, orderBy: { name: 'asc' } });
    }
    async createRoad(neighborhoodId, name, lengthM, widthM) {
        const neighborhood = await this.prisma.neighborhood.findUnique({ where: { id: neighborhoodId } });
        if (!neighborhood)
            throw new Error('Bairro não encontrado.');
        return this.prisma.road.upsert({
            where: { neighborhoodId_name: { neighborhoodId, name } },
            update: { lengthM: lengthM ?? 0, widthM: widthM ?? 0 },
            create: { neighborhoodId, name, lengthM: lengthM ?? 0, widthM: widthM ?? 0 },
        });
    }
    async updateRoad(id, data) {
        return this.prisma.road.update({ where: { id }, data });
    }
    async deleteRoad(id) {
        return this.prisma.road.delete({ where: { id } });
    }
    async findTeamMembers(role) {
        const where = role ? { role: { name: role } } : {};
        return this.prisma.user.findMany({
            where,
            select: { id: true, name: true, role: { select: { name: true } } },
            orderBy: { name: 'asc' },
        });
    }
};
exports.GeographyService = GeographyService;
exports.GeographyService = GeographyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeographyService);
//# sourceMappingURL=geography.service.js.map