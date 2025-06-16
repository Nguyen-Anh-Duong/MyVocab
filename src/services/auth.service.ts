import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import UserModel from '~/models/user.model.js'
import { BadRequestError } from '~/utils/Errors.js'
import { comparePassword, hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { generateAccessToken, generateRefreshToken } from './token.service.js'
import verifyTokenModel from '~/models/verifyToken.model.js'
import { sendEmail } from '~/utils/email.js'
import { APP_URL } from '~/config/index.js'

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
    if (verifyToken.createdAt.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
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
    await verifyTokenModel.deleteMany({ userId: user._id })
    return toUserResponse(user)
  }

  login = async (userData: LoginUserDto) => {
    const { email, password } = userData
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new BadRequestError({ message: 'User not exist.' })
    }
    const compare = await comparePassword(password, user.passwordHash)
    if (!compare) {
      throw new BadRequestError({ message: 'Invalid Password.' })
    }
    const accessToken = await generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user)
    return {
      account: toUserResponse(user),
      token: { accessToken, refreshToken }
    }
  }
}

export default AuthService
