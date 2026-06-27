import { Strategy } from 'passport-jwt';
import { PrismaService } from '../infrastructure/database/prisma.service';
export interface JwtPayload {
    sub: string;
    login: string;
    profile: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        login: string;
        name: string;
        profile: import("@prisma/client").$Enums.UserProfile;
        active: boolean;
    }>;
}
export {};
