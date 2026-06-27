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
    const user = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (!user || !user.active) throw new UnauthorizedException('Usuário ou senha inválidos.')

    const passwordValid = await bcrypt.compare(dto.password, user.password)
    if (!passwordValid) throw new UnauthorizedException('Usuário ou senha inválidos.')

    const payload = { sub: user.id, login: user.login, profile: user.profile }
    const token = this.jwtService.sign(payload)

    return { token, user: { id: user.id, login: user.login, name: user.name, profile: user.profile } }
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { login: dto.login } })
    if (existing) throw new ConflictException('Este usuário já existe.')

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { login: dto.login, password: hashedPassword, name: dto.name, profile: dto.profile },
      select: { id: true, login: true, name: true, profile: true, active: true, createdAt: true },
    })
    return user
  }

  async seedAdmin() {
    const count = await this.prisma.user.count()
    if (count > 0) return

    const hashedPassword = await bcrypt.hash('1234', 10)
    await this.prisma.user.create({
      data: { login: 'admin', password: hashedPassword, name: 'ADMIN', profile: 'admin' },
    })
  }
}
