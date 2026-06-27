import { IsString, MinLength } from 'class-validator'

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

  @IsString()
  @MinLength(1)
  roleName: string
}
