"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../core/infrastructure/database/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { login: dto.login },
            include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        });
        if (!user || !user.active)
            throw new common_1.UnauthorizedException('Usuário ou senha inválidos.');
        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid)
            throw new common_1.UnauthorizedException('Usuário ou senha inválidos.');
        const permissions = user.role.rolePermissions.map((rp) => rp.permission.key);
        const payload = {
            sub: user.id,
            login: user.login,
            roleId: user.roleId,
            roleName: user.role.name,
        };
        const token = this.jwtService.sign(payload);
        return {
            token,
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
                role: user.role.name,
                permissions,
            },
        };
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { login: dto.login } });
        if (existing)
            throw new common_1.ConflictException('Este usuário já existe.');
        const role = await this.prisma.role.findUnique({ where: { name: dto.roleName } });
        if (!role)
            throw new common_1.ConflictException('Perfil inválido.');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { login: dto.login, password: hashedPassword, name: dto.name, roleId: role.id },
            select: { id: true, login: true, name: true, active: true, createdAt: true },
        });
        return user;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        });
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado.');
        const permissions = user.role.rolePermissions.map((rp) => rp.permission.key);
        return {
            id: user.id,
            login: user.login,
            name: user.name,
            role: user.role.name,
            permissions,
        };
    }
    async seedDefaults() {
        const roleCount = await this.prisma.role.count();
        if (roleCount > 0)
            return;
        const permissions = [
            { key: 'dashboard:view', description: 'Visualizar dashboard', group: 'dashboard' },
            { key: 'records:create', description: 'Criar lançamentos', group: 'records' },
            { key: 'records:read', description: 'Visualizar lançamentos', group: 'records' },
            { key: 'records:update', description: 'Editar lançamentos', group: 'records' },
            { key: 'records:delete', description: 'Excluir lançamentos', group: 'records' },
            { key: 'corrections:view', description: 'Visualizar correções', group: 'corrections' },
            { key: 'corrections:manage', description: 'Gerenciar correções', group: 'corrections' },
            { key: 'settings:read', description: 'Visualizar cadastros', group: 'settings' },
            { key: 'settings:write', description: 'Editar cadastros', group: 'settings' },
            { key: 'users:read', description: 'Visualizar usuários', group: 'users' },
            { key: 'users:write', description: 'Gerenciar usuários', group: 'users' },
            { key: 'reports:whatsapp', description: 'Relatório WhatsApp', group: 'reports' },
            { key: 'reports:pdf', description: 'Relatório PDF', group: 'reports' },
            { key: 'reports:cadastros', description: 'Relatórios de cadastros', group: 'reports' },
            { key: 'reports:controle', description: 'Controle de relatórios', group: 'reports' },
            { key: 'reports:planilha', description: 'Planilha de medição', group: 'reports' },
            { key: 'analysis:estimativa', description: 'Estimativa financeira', group: 'analysis' },
            { key: 'analysis:avanco', description: 'Avanço da obra', group: 'analysis' },
            { key: 'analysis:prateleira', description: 'Prateleira', group: 'analysis' },
            { key: 'analysis:historico', description: 'Histórico da via', group: 'analysis' },
            { key: 'system:backup', description: 'Backup e sistema', group: 'system' },
        ];
        for (const p of permissions) {
            await this.prisma.permission.upsert({ where: { key: p.key }, update: {}, create: p });
        }
        const adminRole = await this.prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: { name: 'admin', description: 'Administrador com acesso total' },
        });
        const apontadorRole = await this.prisma.role.upsert({
            where: { name: 'apontador' },
            update: {},
            create: { name: 'apontador', description: 'Apontador de campo' },
        });
        const allPermissions = await this.prisma.permission.findMany();
        for (const p of allPermissions) {
            await this.prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
                update: {},
                create: { roleId: adminRole.id, permissionId: p.id },
            });
        }
        const apontadorPermissions = [
            'dashboard:view',
            'records:create',
            'records:read',
            'corrections:view',
            'reports:whatsapp',
        ];
        for (const key of apontadorPermissions) {
            const p = await this.prisma.permission.findUnique({ where: { key } });
            if (p) {
                await this.prisma.rolePermission.upsert({
                    where: { roleId_permissionId: { roleId: apontadorRole.id, permissionId: p.id } },
                    update: {},
                    create: { roleId: apontadorRole.id, permissionId: p.id },
                });
            }
        }
        const hashedPassword = await bcrypt.hash('1234', 10);
        const adminExists = await this.prisma.user.findUnique({ where: { login: 'admin' } });
        if (!adminExists) {
            await this.prisma.user.create({
                data: { login: 'admin', password: hashedPassword, name: 'ADMIN', roleId: adminRole.id },
            });
        }
        const apontadorExists = await this.prisma.user.findUnique({ where: { login: 'apontador' } });
        if (!apontadorExists) {
            await this.prisma.user.create({
                data: { login: 'apontador', password: hashedPassword, name: 'APONTADOR', roleId: apontadorRole.id },
            });
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map