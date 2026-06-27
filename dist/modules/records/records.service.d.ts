import { PrismaService } from '../../core/infrastructure/database/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto';
export declare class RecordsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRecordDto, userId?: string): Promise<{
        road: ({
            neighborhood: {
                city: {
                    state: {
                        id: string;
                        name: string;
                        code: string;
                    };
                } & {
                    id: string;
                    name: string;
                    stateId: string;
                    ibgeCode: string;
                };
            } & {
                id: string;
                name: string;
                cityId: string;
            };
        } & {
            id: string;
            name: string;
            lengthM: number;
            widthM: number;
            status: string;
            neighborhoodId: string;
        }) | null;
        supervisor: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
        recorder: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        roadId: string | null;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisorId: string | null;
        recorderId: string | null;
        userId: string | null;
    }>;
    createBatch(batch: CreateRecordsBatchDto, userId?: string): Promise<{
        count: number;
    }>;
    findAll(query: {
        date?: string;
        start?: string;
        end?: string;
        roadId?: string;
        recorderId?: string;
    }): Promise<({
        user: {
            id: string;
            name: string;
        } | null;
        road: ({
            neighborhood: {
                city: {
                    state: {
                        id: string;
                        name: string;
                        code: string;
                    };
                } & {
                    id: string;
                    name: string;
                    stateId: string;
                    ibgeCode: string;
                };
            } & {
                id: string;
                name: string;
                cityId: string;
            };
        } & {
            id: string;
            name: string;
            lengthM: number;
            widthM: number;
            status: string;
            neighborhoodId: string;
        }) | null;
        supervisor: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
        recorder: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        roadId: string | null;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisorId: string | null;
        recorderId: string | null;
        userId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
        } | null;
        road: ({
            neighborhood: {
                city: {
                    state: {
                        id: string;
                        name: string;
                        code: string;
                    };
                } & {
                    id: string;
                    name: string;
                    stateId: string;
                    ibgeCode: string;
                };
            } & {
                id: string;
                name: string;
                cityId: string;
            };
        } & {
            id: string;
            name: string;
            lengthM: number;
            widthM: number;
            status: string;
            neighborhoodId: string;
        }) | null;
        supervisor: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
        recorder: {
            id: string;
            login: string;
            password: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        roadId: string | null;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisorId: string | null;
        recorderId: string | null;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeBatch(ids: string[]): Promise<{
        count: number;
    }>;
}
