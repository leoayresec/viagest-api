import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    update(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        updatedAt: Date;
    }>;
    deactivate(id: string, currentUserId: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
    }> | {
        message: string;
    };
    reactivate(id: string): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
    }>;
    remove(id: string, currentUserId: string): Promise<void> | {
        message: string;
    };
}
