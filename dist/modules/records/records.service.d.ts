import { PrismaService } from '../../core/infrastructure/database/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto';
export declare class RecordsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateRecordDto, userId?: string): Promise<{
        road: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        neighborhood: string;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisor: string | null;
        recorder: string | null;
        userId: string | null;
    }>;
    createBatch(batch: CreateRecordsBatchDto, userId?: string): Promise<{
        count: number;
    }>;
    findAll(query: {
        date?: string;
        start?: string;
        end?: string;
        neighborhood?: string;
        road?: string;
        recorder?: string;
    }): Promise<({
        user: {
            id: string;
            name: string;
        } | null;
    } & {
        road: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        neighborhood: string;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisor: string | null;
        recorder: string | null;
        userId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
        } | null;
    } & {
        road: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/client").JsonValue;
        date: Date;
        neighborhood: string;
        serviceType: import("@prisma/client").$Enums.ServiceType;
        supervisor: string | null;
        recorder: string | null;
        userId: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    removeBatch(ids: string[]): Promise<{
        count: number;
    }>;
}
