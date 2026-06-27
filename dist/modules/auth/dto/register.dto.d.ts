import { UserProfile } from '@prisma/client';
export declare class RegisterDto {
    login: string;
    password: string;
    name: string;
    profile: UserProfile;
}
