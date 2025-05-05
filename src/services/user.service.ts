import UserModel from '~/models/user.model.js'
import { toUserResponse } from '~/utils/user.utils.js'

class UserService {
  getUserInfo = async (userId: string) => {
    const user = await UserModel.findById(userId).lean()
    return user
  }
}

export default new UserService()
