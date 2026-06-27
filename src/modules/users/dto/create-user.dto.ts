import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator'
import { UserProfile } from '@prisma/client'

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  login: string

  @IsString()
  @MinLength(4)
  password: string

  @IsString()
  @MinLength(1)
  name: string

  @IsEnum(UserProfile)
  profile: UserProfile
}
