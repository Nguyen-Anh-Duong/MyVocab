import UserModel from '~/models/user.model.js'
import { toUserResponse } from '~/utils/user.utils.js'
import { UpdateUserDto, UpdateUserStatusDto } from '~/dtos/user.dto.js'
import { NotFoundError, BadRequestError, ForbiddenError } from '~/utils/Errors.js'
import { Role } from '~/config/role.js'

class UserService {
  getUserInfo = async (userId: string) => {
    const user = await UserModel.findById(userId).lean()

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    return toUserResponse(user)
  }

  // Admin methods for user management
  getAllUsers = async () => {
    const users = await UserModel.find().sort({ createdAt: -1 }).lean()
    return users.map((user) => toUserResponse(user))
  }

  getUserById = async (userId: string) => {
    const user = await UserModel.findById(userId).lean()

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    return toUserResponse(user)
  }

  updateUser = async (userId: string, updateData: UpdateUserDto, adminUser: IUserRequest) => {
    // Check if admin is trying to update themselves
    if (userId === adminUser.userId && updateData.role && updateData.role !== adminUser.role) {
      throw new BadRequestError({ message: 'Admin cannot change their own role' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    // Check if email already exists (if updating email)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: userId }
      })

      if (existingUser) {
        throw new BadRequestError({ message: 'Email already exists' })
      }
    }

    // Check if username already exists (if updating username)
    // if (updateData.username && updateData.username !== user.username) {
    //   const existingUser = await UserModel.findOne({
    //     username: updateData.username,
    //     _id: { $ne: userId }
    //   })

    //   if (existingUser) {
    //     throw new BadRequestError({ message: 'Username already exists' })
    //   }
    // }

    // Update fields
    if (updateData.username !== undefined) user.username = updateData.username
    if (updateData.email !== undefined) user.email = updateData.email
    if (updateData.role !== undefined) user.role = updateData.role

    await user.save()
    return toUserResponse(user.toObject())
  }

  updateUserStatus = async (userId: string, statusData: UpdateUserStatusDto, adminUser: IUserRequest) => {
    // Prevent admin from suspending themselves
    if (userId === adminUser.userId && statusData.status === 'suspended') {
      throw new BadRequestError({ message: 'Admin cannot suspend themselves' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    // Update status
    user.status = statusData.status

    // Set suspension reason if suspending
    if (statusData.status === 'suspended') {
      user.suspensionReason = statusData.suspensionReason || 'No reason provided'
    } else {
      // Clear suspension reason if not suspended
      user.suspensionReason = undefined
    }

    await user.save()
    return toUserResponse(user.toObject())
  }

  deleteUser = async (userId: string, adminUser: IUserRequest) => {
    // Prevent admin from deleting themselves
    if (userId === adminUser.userId) {
      throw new BadRequestError({ message: 'Admin cannot delete themselves' })
    }

    const user = await UserModel.findById(userId)

    if (!user) {
      throw new NotFoundError({ message: 'User not found' })
    }

    user.status = 'deactivated' // Soft delete by changing status
    await user.save()

    return { message: 'User deleted successfully' }
  }
}

export default new UserService()
