import UserModel from '~/models/user.model.js'
import { toUserResponse } from '~/utils/user.utils.js'

class UserService {
  getUserInfo = async (userId: string) => {
    const user = await UserModel.findById(userId).lean()

    if (!user) {
      throw new Error('User not found')
    }

    return toUserResponse(user)
  }
}

export default new UserService()
