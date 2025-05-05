import { NextFunction, Request, Response } from 'express'
import userService from '~/services/user.service.js'

class UserController {
  me = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const data = await userService.getUserInfo(user!.userId)
    res.status(200).json(data)
  }
}

export default new UserController()
