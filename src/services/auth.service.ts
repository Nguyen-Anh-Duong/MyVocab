import { CreateUserDto } from '~/dtos/users.dto.js'
import UserModel from '~/models/users.model.js'
import { hashPassword } from '~/utils/hash.js'
import { toUserResponse } from '~/utils/user.utils.js'

class AuthService {
  register = async (userData: CreateUserDto): Promise<IUserResponse> => {
    const { email, username, password } = userData

    //check whether email exist or not
    const existingUser = await UserModel.findOne({ email })
    // if (existingUser) {
    //   throw new Error('Email already exists')
    // }

    //hash password
    const passwordHash = await hashPassword(password)
    const createUser: IUser = await UserModel.create({ email, username, passwordHash })
    return toUserResponse(createUser)
  }
}

export default AuthService
