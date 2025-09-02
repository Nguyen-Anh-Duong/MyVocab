import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import UserModel from '~/models/user.model.js'
import { BadRequestError } from '~/utils/Errors.js'
import { comparePassword, hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { generateAccessToken, generateRefreshToken } from './token.service.js'
import verifyTokenModel from '~/models/verifyToken.model.js'
import { sendEmail } from '~/utils/email.js'
import { CLIENT_ID, CLIENT_SECRET, FRONTEND_URL, REDIRECT_URI } from '~/config/index.js'
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
        <a href="${FRONTEND_URL}/verify-email?token=${verifyToken.token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${FRONTEND_URL}/verify-email?token=${verifyToken.token}</p>
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

  resendVerificationEmail = async (email: string): Promise<void> => {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }

    if (user.status !== 'pending') {
      throw new BadRequestError({ message: 'User already verified.' })
    }

    // Delete existing verification token
    await verifyTokenModel.deleteMany({ userId: user._id })

    // Create new verification token
    const verifyToken = await verifyTokenModel.create({ userId: user._id, token: crypto.randomUUID() })

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Verify Your Email</h2>
        <p>You requested to resend the verification email. Please verify your email by clicking the link below:</p>
        <a href="${FRONTEND_URL}/verify-email?token=${verifyToken.token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${FRONTEND_URL}/verify-email?token=${verifyToken.token}</p>
        <p>This link will expire in 1 hour.</p>
        <p>Thank you!</p>
      </div>
      `
    })
  }

  login = async (userData: LoginUserDto) => {
    const { email, password } = userData
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    if (user.status === 'pending') {
      throw new BadRequestError({ message: 'User not active. Please verify your email.' })
    }
    if (user.status === 'suspended') {
      throw new BadRequestError({ message: 'User is suspended. Please contact support.' })
    }
    if (user.status === 'deactivated') {
      throw new BadRequestError({ message: 'User is deactivated. Please contact support.' })
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
      <a href="${FRONTEND_URL}/reset-password?token=${resetPasswordToken.token}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p>${FRONTEND_URL}/reset-password?token=${resetPasswordToken.token}</p>
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

  googleLogin = async (code: string) => {
    // Exchange authorization code for access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new BadRequestError({ message: 'Failed to exchange code for tokens' })
    }

    // Use access_token or id_token to fetch user profile
    const { access_token, id_token } = data

    const userProfileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const userProfile = await userProfileResponse.json()
    if (!userProfileResponse.ok) {
      throw new BadRequestError({ message: 'Failed to fetch user profile' })
    }

    //handle user authentication and retrieval using the profile data
    const { email, name } = userProfile
    const user = await UserModel.findOne({ email })

    //if user existed, check status and generate tokens
    if (user) {
      switch (user.status) {
        case 'suspended':
          throw new BadRequestError({ message: 'User is suspended. Please contact support.' })
        case 'deactivated':
          throw new BadRequestError({ message: 'User is deactivated. Please contact support.' })
        case 'pending':
          user.status = 'active'
          await user.save()
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
    } else {
      //if user not existed, create new user
      const newUser = await UserModel.create({
        email,
        username: name || email.split('@')[0],
        passwordHash: crypto.randomUUID(), // generate a random password
        status: 'active',
        role: 'user' // default role
      })

      const accessToken = await generateAccessToken(newUser)
      const { encoded, tokenId } = await generateRefreshToken(newUser)

      //save refresh token to redis
      const key = `refresh:${newUser._id}:${tokenId}`
      await redis.set(key, tokenId, { EX: 60 * 60 * 24 }) // 1 day expiration

      return {
        account: toUserResponse(newUser),
        token: { accessToken, refreshToken: encoded, familyToken: tokenId }
      }
    }
  }
}
export default AuthService
