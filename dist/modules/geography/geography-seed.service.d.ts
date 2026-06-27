import { PrismaService } from '../../core/infrastructure/database/prisma.service';
export declare class GeographySeedService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    seed(): Promise<void>;
    private seedStates;
    private seedCities;
    private seedBelémData;
    getStats(): Promise<{
        states: number;
        cities: number;
        neighborhoods: number;
        roads: number;
    }>;
}
