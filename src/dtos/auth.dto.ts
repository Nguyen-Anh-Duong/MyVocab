import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class TokenDto {
  @IsNotEmpty()
  @IsString()
  token!: string
}

export class VerifyEmailDto {
  @IsNotEmpty()
  token!: string
}

export class ResendVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string
}

export class ResetPasswordDto {
  @IsNotEmpty()
  password!: string
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(0)
  oldPassword!: string

  @IsNotEmpty()
  @MinLength(0)
  newPassword!: string
}
