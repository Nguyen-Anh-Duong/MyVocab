import { NextFunction, Request, Response } from 'express'
import userService from '~/services/user.service.js'
import { catchAsync } from '~/utils/catchAsync.js'

class UserController {
  me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const data = await userService.getUserInfo(user!.userId)
    res.status(200).json({ message: 'Get user info successfully.', data })
  })

  // Admin methods for user management
  getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.getAllUsers()
    res.status(200).json({
      message: 'Get all users successfully',
      data,
      total: data.length
    })
  })

  getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const data = await userService.getUserById(userId)
    res.status(200).json({ message: 'Get user successfully', data })
  })

  updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const updateData = req.body
    const adminUser = req.user!

    const data = await userService.updateUser(userId, updateData, adminUser)
    res.status(200).json({ message: 'User updated successfully', data })
  })

  updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const statusData = req.body
    const adminUser = req.user!

    const data = await userService.updateUserStatus(userId, statusData, adminUser)
    res.status(200).json({ message: 'User status updated successfully', data })
  })

  deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params
    const adminUser = req.user!

    const data = await userService.deleteUser(userId, adminUser)
    res.status(200).json(data)
  })
}

export default new UserController()
