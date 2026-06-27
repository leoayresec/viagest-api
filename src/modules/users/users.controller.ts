import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RequirePermissions } from '../../core/security/roles.decorator'
import { RolesGuard } from '../../core/security/roles.guard'
import { CurrentUser } from '../../core/security/current-user.decorator'

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions('users:read')
  findAll() {
    return this.usersService.findAll()
  }

  @Get('roles')
  @RequirePermissions('users:read')
  findRoles() {
    return this.usersService.findRoles()
  }

  @Get(':id')
  @RequirePermissions('users:read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post()
  @RequirePermissions('users:write')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Put(':id')
  @RequirePermissions('users:write')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      if (dto.roleName !== undefined) {
        const { roleName, ...rest } = dto
        return this.usersService.update(id, rest)
      }
    }
    return this.usersService.update(id, dto)
  }

  @Put(':id/deactivate')
  @RequirePermissions('users:write')
  deactivate(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      return { message: 'Você não pode desativar a si mesmo.' }
    }
    return this.usersService.deactivate(id)
  }

  @Put(':id/reactivate')
  @RequirePermissions('users:write')
  reactivate(@Param('id') id: string) {
    return this.usersService.reactivate(id)
  }

  @Delete(':id')
  @RequirePermissions('users:write')
  remove(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      return { message: 'Você não pode excluir a si mesmo.' }
    }
    return this.usersService.remove(id)
  }
}
