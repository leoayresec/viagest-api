import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator'
import { UserProfile } from '@prisma/client'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  login?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsEnum(UserProfile)
  profile?: UserProfile

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string
}
