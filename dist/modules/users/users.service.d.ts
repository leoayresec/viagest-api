import { PrismaService } from '../../core/infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        updatedAt: Date;
    }>;
    deactivate(id: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
    }>;
    reactivate(id: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
    }>;
    remove(id: string): Promise<void>;
}
