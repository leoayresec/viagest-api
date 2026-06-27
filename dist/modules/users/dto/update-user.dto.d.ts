import { UserProfile } from '@prisma/client';
export declare class UpdateUserDto {
    login?: string;
    name?: string;
    profile?: UserProfile;
    password?: string;
}
