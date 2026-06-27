"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeographySeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeographySeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/infrastructure/database/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let GeographySeedService = GeographySeedService_1 = class GeographySeedService {
    prisma;
    logger = new common_1.Logger(GeographySeedService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async seed() {
        const stateCount = await this.prisma.state.count();
        const cityCount = await this.prisma.city.count();
        if (stateCount === 0)
            await this.seedStates();
        if (cityCount < 5000) {
            if (cityCount > 0)
                await this.prisma.city.deleteMany();
            await this.seedCities();
        }
        await this.seedBelémData();
        const stats = await this.getStats();
        this.logger.log(`Seed: ${stats.states} estados, ${stats.cities} cidades, ${stats.neighborhoods} bairros, ${stats.roads} vias`);
    }
    async seedStates() {
        this.logger.log('Buscando estados do IBGE...');
        try {
            const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=id');
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const states = await res.json();
            await this.prisma.state.createMany({
                data: states.map((s) => ({ id: String(s.id), code: s.sigla, name: s.nome })),
                skipDuplicates: true,
            });
            await this.prisma.state.update({ where: { id: '15' }, data: { active: true } });
            this.logger.log(`${states.length} estados inseridos. Pará ativado.`);
        }
        catch (err) {
            this.logger.error('Erro ao buscar estados do IBGE', err);
        }
    }
    async seedCities() {
        this.logger.log('Buscando municípios do IBGE...');
        try {
            const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=id');
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const cities = await res.json();
            const existingStates = await this.prisma.state.findMany({ select: { id: true } });
            const validStateIds = new Set(existingStates.map((s) => s.id));
            const batchSize = 500;
            let inserted = 0;
            for (let i = 0; i < cities.length; i += batchSize) {
                const batch = cities
                    .slice(i, i + batchSize)
                    .filter((c) => c.microrregiao?.mesorregiao?.UF?.id != null)
                    .map((c) => ({
                    id: String(c.id),
                    stateId: String(c.microrregiao.mesorregiao.UF.id),
                    name: c.nome,
                    ibgeCode: String(c.id),
                }))
                    .filter((c) => validStateIds.has(c.stateId));
                if (batch.length > 0) {
                    const result = await this.prisma.city.createMany({ data: batch, skipDuplicates: true });
                    inserted += result.count;
                }
            }
            this.logger.log(`${inserted} municípios inseridos.`);
        }
        catch (err) {
            this.logger.error('Erro ao buscar municípios do IBGE', err);
        }
    }
    async seedBelémData() {
        const BELEM_IBGE = '1501402';
        const city = await this.prisma.city.findFirst({ where: { ibgeCode: BELEM_IBGE } });
        if (!city) {
            this.logger.warn('Belém não encontrada no banco. Pulando bairros/ruas.');
            return;
        }
        await this.prisma.city.update({ where: { id: city.id }, data: { active: true } });
        const jsonPath = path.join(process.cwd(), 'bairros-ruas-belem.json');
        if (!fs.existsSync(jsonPath)) {
            this.logger.warn('bairros-ruas-belem.json não encontrado. Pulando.');
            return;
        }
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const bairroNames = Object.keys(data).sort();
        this.logger.log(`Inserindo ${bairroNames.length} bairros de Belém...`);
        for (const name of bairroNames) {
            await this.prisma.neighborhood.upsert({
                where: { cityId_name: { cityId: city.id, name } },
                update: {},
                create: { cityId: city.id, name },
            });
        }
        const dbNeighborhoods = await this.prisma.neighborhood.findMany({
            where: { cityId: city.id },
            select: { id: true, name: true },
        });
        const nameToId = new Map(dbNeighborhoods.map((n) => [n.name, n.id]));
        let insertedRoads = 0;
        for (const [bairroName, ruas] of Object.entries(data)) {
            const neighborhoodId = nameToId.get(bairroName);
            if (!neighborhoodId)
                continue;
            for (const ruaName of ruas) {
                try {
                    await this.prisma.road.upsert({
                        where: { neighborhoodId_name: { neighborhoodId, name: ruaName } },
                        update: {},
                        create: { neighborhoodId, name: ruaName },
                    });
                    insertedRoads++;
                }
                catch {
                }
            }
        }
        this.logger.log(`${bairroNames.length} bairros, ${insertedRoads} vias de Belém inseridos.`);
    }
    async getStats() {
        const [states, cities, neighborhoods, roads] = await Promise.all([
            this.prisma.state.count(),
            this.prisma.city.count(),
            this.prisma.neighborhood.count(),
            this.prisma.road.count(),
        ]);
        return { states, cities, neighborhoods, roads };
    }
};
exports.GeographySeedService = GeographySeedService;
exports.GeographySeedService = GeographySeedService = GeographySeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeographySeedService);
//# sourceMappingURL=geography-seed.service.js.map