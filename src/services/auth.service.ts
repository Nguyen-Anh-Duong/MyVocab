import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import UserModel from '~/models/user.model.js'
import { BadRequestError } from '~/utils/Errors.js'
import { comparePassword, hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { generateAccessToken, generateRefreshToken } from './token.service.js'
import verifyTokenModel from '~/models/verifyToken.model.js'
import { sendEmail } from '~/utils/email.js'
import { APP_URL } from '~/config/index.js'
import redis from '~/database/redis.connect.js'
import ResetPasswordTokenModel from '~/models/resetPasswordToken.model.js'

class AuthService {
  register = async (userData: CreateUserDto): Promise<void> => {
    const { email, username, password } = userData

    //check whether email exist or not
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      throw new BadRequestError({ message: 'User have already existed.' })
    }

    //hash password
    const passwordHash = await hashPassword(password)
    const user: IUser = await UserModel.create({ email, username, passwordHash })

    const verifyToken = await verifyTokenModel.create({ userId: user._id, token: crypto.randomUUID() })
    // send email to user
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Verify Your Email</h2>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${APP_URL}/verify-email?token=${verifyToken.token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${APP_URL}/verify-email?token=${verifyToken.token}</p>
        <p>Thank you!</p>
      </div>
      `
    })
  }

  verifyEmail = async (verifyEmailToken: string) => {
    const verifyToken = await verifyTokenModel.findOne({ token: verifyEmailToken })
    if (!verifyToken) {
      throw new BadRequestError({ message: 'Invalid token.' })
    }
    // Check if the token is expired (1 hour)
    if (verifyToken.createdAt.getTime() < Date.now() - 1 * 60 * 60 * 1000) {
      throw new BadRequestError({ message: 'Token expired.' })
    }

    const user = await UserModel.findById(verifyToken.userId)
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    if (user.status !== 'pending') {
      throw new BadRequestError({ message: 'User already verified.' })
    }
    user.status = 'active'
    await user.save()

    return toUserResponse(user)
  }

  login = async (userData: LoginUserDto) => {
    const { email, password } = userData
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    if (user.status !== 'active') {
      throw new BadRequestError({ message: 'User not active. Please verify your email.' })
    }
    const compare = await comparePassword(password, user.passwordHash)
    if (!compare) {
      throw new BadRequestError({ message: 'Invalid Password.' })
    }
    const accessToken = await generateAccessToken(user)
    const { encoded, tokenId } = await generateRefreshToken(user)

    //save refresh token to redis
    const key = `refresh:${user._id}:${tokenId}`
    await redis.set(key, tokenId, { EX: 60 * 60 * 24 }) // 1 day expiration

    return {
      account: toUserResponse(user),
      token: { accessToken, refreshToken: encoded, familyToken: tokenId }
    }
  }

  refreshAccessToken = async (familyId: string, userId: string) => {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    const accessToken = await generateAccessToken(user)
    const { encoded, tokenId } = await generateRefreshToken(user)

    //save refresh token to redis
    const key = `refresh:${userId}:${familyId}`
    await redis.set(key, tokenId as string, { EX: 60 * 60 * 24 }) // 1 day expiration

    return { token: { accessToken, refreshToken: encoded as string, familyToken: familyId } }
  }

  logout = async (familyId: string, userId: string) => {
    //delete refresh token from redis
    const key = `refresh:${userId}:${familyId}`
    await redis.del(key)
  }

  logoutAllDevice = async (userId: string) => {
    //delete all refresh tokens from redis
    const keys = await redis.keys(`refresh:${userId}:*`)
    if (keys.length > 0) {
      await redis.del(keys)
    }
  }

  forgotPassword = async (email: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    const resetPasswordToken = await ResetPasswordTokenModel.create({ userId: user._id, token: crypto.randomUUID() })

    await sendEmail({
      to: email,
      subject: 'Reset password',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <a href="${APP_URL}/reset-password?token=${resetPasswordToken.token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p>${APP_URL}/reset-password?token=${resetPasswordToken.token}</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you!</p>
    </div>`
    })
  }

  resetPassword = async (token: string, newPassword: string) => {
    const resetToken = await ResetPasswordTokenModel.findOne({ token })
    if (!resetToken) {
      throw new BadRequestError({
        message: 'Reset link is invalid.'
      })
    }

    if (resetToken.createdAt.getTime() < Date.now() - 1 * 60 * 60 * 1000) {
      // 1 hour expiration
      throw new BadRequestError({ message: 'Reset link has expired.' })
    }

    const user = await UserModel.findById(resetToken.userId)
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    user.passwordHash = await hashPassword(newPassword)
    await user.save()

    return toUserResponse(user)
  }

  changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    const compare = await comparePassword(oldPassword, user.passwordHash)
    if (!compare) {
      throw new BadRequestError({ message: 'Password incorrect.' })
    }
    user.passwordHash = await hashPassword(newPassword)
    await user.save()
  }
}
export default AuthService
