import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum, IsMongoId } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  username!: string

  @MinLength(0)
  password!: string
}

export class LoginUserDto {
  @IsEmail()
  email!: string

  @MinLength(0)
  password!: string
}

export class UserIdDto {
  @IsMongoId({ message: 'Invalid user ID.' })
  userId!: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  username?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role?: 'user' | 'admin'
}

export class UpdateUserStatusDto {
  @IsEnum(['active', 'pending', 'suspended', 'deactivated'], {
    message: 'Status must be one of: active, pending, suspended, deactivated'
  })
  status!: 'active' | 'pending' | 'suspended' | 'deactivated'

  @IsOptional()
  @IsNotEmpty()
  suspensionReason?: string
}
