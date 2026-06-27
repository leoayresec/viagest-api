import { UserProfile } from '@prisma/client';
export declare class CreateUserDto {
    login: string;
    password: string;
    name: string;
    profile: UserProfile;
}
