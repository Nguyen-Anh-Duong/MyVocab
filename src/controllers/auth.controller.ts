import { NextFunction, Request, Response } from 'express'
import AuthService from '~/services/auth.service.js'
import { catchAsync } from '~/utils/catchAsync.js'

class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    await this.authService.register(userData)
    res.status(201).json({ message: 'Register successfully. Please verify your email.' })
  }

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query
    const data = await this.authService.verifyEmail(token as string)
    res.status(200).json({ message: 'Verify email success.', data })
  }

  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const data = await this.authService.login(userData)
    res.status(200).json({ message: 'Login success.', data })
  })
}

export default AuthController
