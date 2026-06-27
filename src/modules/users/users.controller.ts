import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from '../../core/security/roles.decorator'
import { RolesGuard } from '../../core/security/roles.guard'
import { CurrentUser } from '../../core/security/current-user.decorator'

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      if (dto.profile !== undefined) {
        const { profile, ...rest } = dto
        return this.usersService.update(id, rest)
      }
    }
    return this.usersService.update(id, dto)
  }

  @Put(':id/deactivate')
  deactivate(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      return { message: 'Você não pode desativar a si mesmo.' }
    }
    return this.usersService.deactivate(id)
  }

  @Put(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.usersService.reactivate(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') currentUserId: string) {
    if (id === currentUserId) {
      return { message: 'Você não pode excluir a si mesmo.' }
    }
    return this.usersService.remove(id)
  }
}
