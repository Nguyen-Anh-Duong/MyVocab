import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import UserModel from '~/models/user.model.js'
import { BadRequestError } from '~/utils/Errors.js'
import { comparePassword, hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { generateAccessToken, generateRefreshToken } from './token.service.js'

class AuthService {
  register = async (userData: CreateUserDto): Promise<IUserResponse> => {
    const { email, username, password } = userData

    //check whether email exist or not
    const existingUser = await UserModel.findOne({ email })
    // if (existingUser) {
    //   throw new BadRequestError({ message: 'User have already existed.' })
    // }

    //hash password
    const passwordHash = await hashPassword(password)
    const user: IUser = await UserModel.create({ email, username, passwordHash })
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
