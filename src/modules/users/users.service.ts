import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../core/infrastructure/database/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true, createdAt: true, updatedAt: true },
      orderBy: { name: 'asc' },
    }).then((users) => users.map((u) => ({ ...u, role: u.role.name })))
  }

  async findRoles() {
    return this.prisma.role.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true, createdAt: true, updatedAt: true },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado.')
    return { ...user, role: user.role.name }
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (existing) throw new ConflictException('Este login já existe.')

    const role = await this.prisma.role.findUnique({ where: { name: dto.roleName } })
    if (!role) throw new ConflictException('Perfil inválido.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { login: dto.login, password: hashedPassword, name: dto.name, roleId: role.id },
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true, createdAt: true },
    })
    return { ...user, role: user.role.name }
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    if (dto.login && dto.login !== user.login) {
      const existing = await this.prisma.user.findUnique({ where: { login: dto.login } })
      if (existing) throw new ConflictException('Este login já está em uso.')
    }

    const data: any = {}
    if (dto.login !== undefined) data.login = dto.login
    if (dto.name !== undefined) data.name = dto.name
    if (dto.roleName !== undefined) {
      const role = await this.prisma.role.findUnique({ where: { name: dto.roleName } })
      if (!role) throw new ConflictException('Perfil inválido.')
      data.roleId = role.id
    }
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10)

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true, updatedAt: true },
    })
    return { ...updated, role: updated.role.name }
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { role: true } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    const adminRole = await this.prisma.role.findUnique({ where: { name: 'admin' } })
    if (adminRole) {
      const activeAdmins = await this.prisma.user.count({ where: { roleId: adminRole.id, active: true } })
      if (activeAdmins <= 1 && user.roleId === adminRole.id) {
        throw new BadRequestException('Não é possível desativar o único administrador ativo.')
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { active: false },
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true },
    })
    return { ...updated, role: updated.role.name }
  }

  async reactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    const updated = await this.prisma.user.update({
      where: { id },
      data: { active: true },
      select: { id: true, login: true, name: true, role: { select: { name: true } }, active: true },
    })
    return { ...updated, role: updated.role.name }
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { role: true } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    const adminRole = await this.prisma.role.findUnique({ where: { name: 'admin' } })
    if (adminRole) {
      const activeAdmins = await this.prisma.user.count({ where: { roleId: adminRole.id, active: true } })
      if (activeAdmins <= 1 && user.roleId === adminRole.id) {
        throw new BadRequestException('Não é possível excluir o único administrador ativo.')
      }
    }

    await this.prisma.user.delete({ where: { id } })
  }
}
