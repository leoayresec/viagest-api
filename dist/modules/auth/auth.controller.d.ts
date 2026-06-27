import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            login: string;
            name: string;
            profile: import("@prisma/client").$Enums.UserProfile;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
        createdAt: Date;
    }>;
}
