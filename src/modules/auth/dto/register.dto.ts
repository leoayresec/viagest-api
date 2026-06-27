import { IsString, MinLength, IsEnum } from 'class-validator'
import { UserProfile } from '@prisma/client'

export class RegisterDto {
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
