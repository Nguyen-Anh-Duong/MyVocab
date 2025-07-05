import { NextFunction, Request, Response } from 'express'
import userService from '~/services/user.service.js'

class UserController {
  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      const data = await userService.getUserInfo(user!.userId)
      res.status(200).json({ message: 'Get user info successfully.', data })
    } catch (error) {
      next(error)
    }
  }

  // Admin methods for user management
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userService.getAllUsers()
      res.status(200).json({
        message: 'Get all users successfully',
        data,
        total: data.length
      })
    } catch (error) {
      next(error)
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const data = await userService.getUserById(userId)
      res.status(200).json({ message: 'Get user successfully', data })
    } catch (error) {
      next(error)
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const updateData = req.body
      const adminUser = req.user!

      const data = await userService.updateUser(userId, updateData, adminUser)
      res.status(200).json({ message: 'User updated successfully', data })
    } catch (error) {
      next(error)
    }
  }

  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const statusData = req.body
      const adminUser = req.user!

      const data = await userService.updateUserStatus(userId, statusData, adminUser)
      res.status(200).json({ message: 'User status updated successfully', data })
    } catch (error) {
      next(error)
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params
      const adminUser = req.user!

      const data = await userService.deleteUser(userId, adminUser)
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
