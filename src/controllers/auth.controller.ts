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
    res
      .status(200)
      .cookie('familyToken', data.token.familyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1000 // 1 day
      })
      .cookie('refreshToken', data.token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1000 // 1 day
      })
      .json({
        message: 'Login success.',
        data: { account: data.account, token: { accessToken: data.token.accessToken } }
      })
  })

  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const familyId = req.cookies['familyToken']
    const userId = req.user?.userId as string
    const data = await this.authService.refreshAccessToken(familyId, userId)
    res
      .status(200)
      .cookie('familyToken', data.token.familyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1000 // 1 day
      })
      .cookie('refreshToken', data.token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1000 // 1 day
      })
      .json({ message: 'Refresh token success.', data: { token: { accessToken: data.token.accessToken } } })
  })
}

export default AuthController
