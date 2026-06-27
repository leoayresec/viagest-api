import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    })
    if (!user || !user.active) throw new UnauthorizedException('Usuário ou senha inválidos.')

    const passwordValid = await bcrypt.compare(dto.password, user.password)
    if (!passwordValid) throw new UnauthorizedException('Usuário ou senha inválidos.')

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.key)

    const payload = {
      sub: user.id,
      login: user.login,
      roleId: user.roleId,
      roleName: user.role.name,
    }
    const token = this.jwtService.sign(payload)

    return {
      token,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        role: user.role.name,
        permissions,
      },
    }
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (existing) throw new ConflictException('Este usuário já existe.')

    const role = await this.prisma.role.findUnique({ where: { name: dto.roleName } })
    if (!role) throw new ConflictException('Perfil inválido.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { login: dto.login, password: hashedPassword, name: dto.name, roleId: role.id },
      select: { id: true, login: true, name: true, active: true, createdAt: true },
    })
    return user
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
    })
    if (!user) throw new UnauthorizedException('Usuário não encontrado.')

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.key)

    return {
      id: user.id,
      login: user.login,
      name: user.name,
      role: user.role.name,
      permissions,
    }
  }

  async seedDefaults() {
    const roleCount = await this.prisma.role.count()
    if (roleCount > 0) return

    // Criar permissões
    const permissions = [
      // Dashboard
      { key: 'dashboard:view', description: 'Visualizar dashboard', group: 'dashboard' },
      // Lançamentos
      { key: 'records:create', description: 'Criar lançamentos', group: 'records' },
      { key: 'records:read', description: 'Visualizar lançamentos', group: 'records' },
      { key: 'records:update', description: 'Editar lançamentos', group: 'records' },
      { key: 'records:delete', description: 'Excluir lançamentos', group: 'records' },
      // Correções
      { key: 'corrections:view', description: 'Visualizar correções', group: 'corrections' },
      { key: 'corrections:manage', description: 'Gerenciar correções', group: 'corrections' },
      // Cadastros
      { key: 'settings:read', description: 'Visualizar cadastros', group: 'settings' },
      { key: 'settings:write', description: 'Editar cadastros', group: 'settings' },
      // Usuários
      { key: 'users:read', description: 'Visualizar usuários', group: 'users' },
      { key: 'users:write', description: 'Gerenciar usuários', group: 'users' },
      // Relatórios
      { key: 'reports:whatsapp', description: 'Relatório WhatsApp', group: 'reports' },
      { key: 'reports:pdf', description: 'Relatório PDF', group: 'reports' },
      { key: 'reports:cadastros', description: 'Relatórios de cadastros', group: 'reports' },
      { key: 'reports:controle', description: 'Controle de relatórios', group: 'reports' },
      { key: 'reports:planilha', description: 'Planilha de medição', group: 'reports' },
      // Análise
      { key: 'analysis:estimativa', description: 'Estimativa financeira', group: 'analysis' },
      { key: 'analysis:avanco', description: 'Avanço da obra', group: 'analysis' },
      { key: 'analysis:prateleira', description: 'Prateleira', group: 'analysis' },
      { key: 'analysis:historico', description: 'Histórico da via', group: 'analysis' },
      // Sistema
      { key: 'system:backup', description: 'Backup e sistema', group: 'system' },
    ]

    for (const p of permissions) {
      await this.prisma.permission.upsert({ where: { key: p.key }, update: {}, create: p })
    }

    // Criar roles
    const adminRole = await this.prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', description: 'Administrador com acesso total' },
    })

    const apontadorRole = await this.prisma.role.upsert({
      where: { name: 'apontador' },
      update: {},
      create: { name: 'apontador', description: 'Apontador de campo' },
    })

    // Admin: todas as permissões
    const allPermissions = await this.prisma.permission.findMany()
    for (const p of allPermissions) {
      await this.prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: p.id },
      })
    }

    // Apontador: permissões limitadas
    const apontadorPermissions = [
      'dashboard:view',
      'records:create',
      'records:read',
      'corrections:view',
      'reports:whatsapp',
    ]
    for (const key of apontadorPermissions) {
      const p = await this.prisma.permission.findUnique({ where: { key } })
      if (p) {
        await this.prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: apontadorRole.id, permissionId: p.id } },
          update: {},
          create: { roleId: apontadorRole.id, permissionId: p.id },
        })
      }
    }

    // Criar usuários padrão
    const hashedPassword = await bcrypt.hash('1234', 10)
    const adminExists = await this.prisma.user.findUnique({ where: { login: 'admin' } })
    if (!adminExists) {
      await this.prisma.user.create({
        data: { login: 'admin', password: hashedPassword, name: 'ADMIN', roleId: adminRole.id },
      })
    }
    const apontadorExists = await this.prisma.user.findUnique({ where: { login: 'apontador' } })
    if (!apontadorExists) {
      await this.prisma.user.create({
        data: { login: 'apontador', password: hashedPassword, name: 'APONTADOR', roleId: apontadorRole.id },
      })
    }
  }
}
