import { NextFunction, Request, Response } from 'express'
import AuthService from '~/services/auth.service.js'
import { catchAsync } from '~/utils/catchAsync.js'

class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const user: IUserResponse = await this.authService.register(userData)
    res.status(201).json({ message: 'Register user.', data: user })
  }

  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const data = await this.authService.login(userData)
    res.status(200).json({ message: 'Login success.', data })
  })
}

export default AuthController
