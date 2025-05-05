import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

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
