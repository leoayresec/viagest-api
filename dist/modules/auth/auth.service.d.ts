import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/infrastructure/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            login: string;
            name: string;
            role: string;
            permissions: string[];
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        login: string;
        name: string;
        active: boolean;
        createdAt: Date;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        login: string;
        name: string;
        role: string;
        permissions: string[];
    }>;
    seedDefaults(): Promise<void>;
}
