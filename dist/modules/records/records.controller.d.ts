import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { CreateRecordsBatchDto } from './dto/create-records-batch.dto';
export declare class RecordsController {
    private recordsService;
    constructor(recordsService: RecordsService);
    create(dto: CreateRecordDto, userId: string): Promise<{
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
    createBatch(dto: CreateRecordsBatchDto, userId: string): Promise<{
        count: number;
    }>;
    findAll(date?: string, start?: string, end?: string, neighborhood?: string, road?: string, recorder?: string): Promise<({
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
    removeBatch(body: {
        ids: string[];
    }): Promise<{
        count: number;
    }>;
}
