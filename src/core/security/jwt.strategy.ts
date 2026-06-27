import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../infrastructure/database/prisma.service'

export interface JwtPayload {
  sub: string
  login: string
  roleId: string
  roleName: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'viagest-secret-change-in-production',
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        role: {
          include: {
            rolePermissions: { include: { permission: true } },
          },
        },
      },
    })
    if (!user || !user.active) throw new UnauthorizedException('Usuário inativo ou inexistente')

    const permissions = user.role.rolePermissions.map((rp) => rp.permission.key)

    return {
      id: user.id,
      login: user.login,
      name: user.name,
      roleId: user.roleId,
      role: user.role.name,
      permissions,
    }
  }
}
