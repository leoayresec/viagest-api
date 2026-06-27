import { PrismaService } from '../../core/infrastructure/database/prisma.service';
export declare class GeographyService {
    private prisma;
    constructor(prisma: PrismaService);
    findStates(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    findCitiesByState(stateId: string): Promise<{
        id: string;
        name: string;
        stateId: string;
        ibgeCode: string;
    }[]>;
    findNeighborhoods(cityId: string): Promise<{
        id: string;
        name: string;
        cityId: string;
    }[]>;
    createNeighborhood(cityId: string, name: string): Promise<{
        id: string;
        name: string;
        cityId: string;
    }>;
    deleteNeighborhood(id: string): Promise<{
        id: string;
        name: string;
        cityId: string;
    }>;
    findRoads(neighborhoodId: string): Promise<{
        id: string;
        name: string;
        lengthM: number;
        widthM: number;
        status: string;
        neighborhoodId: string;
    }[]>;
    createRoad(neighborhoodId: string, name: string, lengthM?: number, widthM?: number): Promise<{
        id: string;
        name: string;
        lengthM: number;
        widthM: number;
        status: string;
        neighborhoodId: string;
    }>;
    updateRoad(id: string, data: {
        name?: string;
        lengthM?: number;
        widthM?: number;
        status?: string;
    }): Promise<{
        id: string;
        name: string;
        lengthM: number;
        widthM: number;
        status: string;
        neighborhoodId: string;
    }>;
    deleteRoad(id: string): Promise<{
        id: string;
        name: string;
        lengthM: number;
        widthM: number;
        status: string;
        neighborhoodId: string;
    }>;
    findTeamMembers(role?: string): Promise<{
        role: {
            name: string;
        };
        id: string;
        name: string;
    }[]>;
}
