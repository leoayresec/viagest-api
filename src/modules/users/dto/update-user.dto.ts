import { IsString, IsOptional, MinLength } from 'class-validator'

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
  @IsString()
  @MinLength(1)
  roleName?: string

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string
}
