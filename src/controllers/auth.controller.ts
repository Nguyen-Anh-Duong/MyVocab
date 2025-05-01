import { NextFunction, Request, Response } from 'express'
import AuthService from '~/services/auth.service.js'

class AuthController {
  private authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const user: IUserResponse = await this.authService.register(userData)
    res.status(201).json({ data: user, message: 'Register user.' })
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
  }
}

export default AuthController
