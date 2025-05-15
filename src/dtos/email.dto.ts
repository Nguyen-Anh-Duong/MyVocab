import { IsNotEmpty, MinLength } from 'class-validator'

export class VerifyEmailDto {
  @IsNotEmpty()
  token!: string
}
export class ResendVerificationEmailDto {
  @IsNotEmpty()
  email!: string
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token!: string

  @MinLength(0)
  password!: string
}
