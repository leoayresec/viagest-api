import { PrismaService } from '../../core/infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findRoles(): Promise<{
        id: string;
        name: string;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
        updatedAt: Date;
    }>;
    deactivate(id: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
    }>;
    reactivate(id: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
    }>;
    remove(id: string): Promise<void>;
}
