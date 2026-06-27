import { GeographyService } from './geography.service';
import { GeographySeedService } from './geography-seed.service';
export declare class GeographyController {
    private geographyService;
    private geographySeedService;
    constructor(geographyService: GeographyService, geographySeedService: GeographySeedService);
    getStats(): Promise<{
        states: number;
        cities: number;
        neighborhoods: number;
        roads: number;
    }>;
    findStates(): Promise<{
        id: string;
        name: string;
        code: string;
    }[]>;
    findCities(stateId: string): Promise<{
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
    createNeighborhood(body: {
        cityId: string;
        name: string;
    }): Promise<{
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
    createRoad(body: {
        neighborhoodId: string;
        name: string;
        lengthM?: number;
        widthM?: number;
    }): Promise<{
        id: string;
        name: string;
        lengthM: number;
        widthM: number;
        status: string;
        neighborhoodId: string;
    }>;
    updateRoad(id: string, body: {
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
    findTeam(role?: string): Promise<{
        role: {
            name: string;
        };
        id: string;
        name: string;
    }[]>;
}
