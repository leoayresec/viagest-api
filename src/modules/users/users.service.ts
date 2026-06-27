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
      select: { id: true, login: true, name: true, profile: true, active: true, createdAt: true, updatedAt: true },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, login: true, name: true, profile: true, active: true, createdAt: true, updatedAt: true },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado.')
    return user
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (existing) throw new ConflictException('Este login já existe.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    return this.prisma.user.create({
      data: { login: dto.login, password: hashedPassword, name: dto.name, profile: dto.profile },
      select: { id: true, login: true, name: true, profile: true, active: true, createdAt: true },
    })
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
    if (dto.profile !== undefined) data.profile = dto.profile
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10)

    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, login: true, name: true, profile: true, active: true, updatedAt: true },
    })
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    const activeAdmins = await this.prisma.user.count({ where: { profile: 'admin', active: true } })
    if (activeAdmins <= 1 && user.profile === 'admin') {
      throw new BadRequestException('Não é possível desativar o único administrador ativo.')
    }

    return this.prisma.user.update({
      where: { id },
      data: { active: false },
      select: { id: true, login: true, name: true, profile: true, active: true },
    })
  }

  async reactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    return this.prisma.user.update({
      where: { id },
      data: { active: true },
      select: { id: true, login: true, name: true, profile: true, active: true },
    })
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuário não encontrado.')

    const activeAdmins = await this.prisma.user.count({ where: { profile: 'admin', active: true } })
    if (activeAdmins <= 1 && user.profile === 'admin') {
      throw new BadRequestException('Não é possível excluir o único administrador ativo.')
    }

    await this.prisma.user.delete({ where: { id } })
  }
}
