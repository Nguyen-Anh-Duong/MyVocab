import { CreateUserDto, LoginUserDto } from '~/dtos/users.dto.js'
import UserModel from '~/models/users.model.js'
import BadRequestError, { CustomError } from '~/utils/Errors.js'
import { comparePassword, hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { generateAccessToken } from './tokens.service.js'

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
    const createUser: IUser = await UserModel.create({ email, username, passwordHash })
    return toUserResponse(createUser)
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
    const token = generateAccessToken(user)
    return token
  }
}

export default AuthService
