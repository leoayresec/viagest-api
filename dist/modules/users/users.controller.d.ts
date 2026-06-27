import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    update(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
        updatedAt: Date;
    }>;
    deactivate(id: string, currentUserId: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
    }> | {
        message: string;
    };
    reactivate(id: string): Promise<{
        role: string;
        id: string;
        login: string;
        name: string;
        active: boolean;
    }>;
    remove(id: string, currentUserId: string): Promise<void> | {
        message: string;
    };
}
