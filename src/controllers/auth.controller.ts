import { NextFunction, Request, Response } from 'express'
import { CookieOptions } from 'express-serve-static-core'
import AuthService from '~/services/auth.service.js'
import { catchAsync } from '~/utils/catchAsync.js'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 60 * 60 * 24 * 1000 // 1 day
}

class AuthController {
  private authService = new AuthService()

  register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    await this.authService.register(userData)
    res.status(201).json({ message: 'Register successfully. Please verify your email.' })
  })

  verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query
    const data = await this.authService.verifyEmail(token as string)
    res.status(200).json({ message: 'Verify email success.', data })
  })

  resendVerificationEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    await this.authService.resendVerificationEmail(email)
    res.status(200).json({ message: 'Verification email resent successfully. Please check your email.' })
  })

  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const data = await this.authService.login(userData)
    res
      .status(200)
      .cookie('familyToken', data.token.familyToken, cookieOptions)
      .cookie('refreshToken', data.token.refreshToken, cookieOptions)
      .json({
        message: 'Login success.',
        data: { account: data.account, token: { accessToken: data.token.accessToken } }
      })
  })

  // refresh access token and rotation refresh token
  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const familyId = req.cookies['familyToken']
    const userId = req.user?.userId as string
    const data = await this.authService.refreshAccessToken(familyId, userId)
    res
      .status(200)
      .cookie('familyToken', data.token.familyToken, cookieOptions)
      .cookie('refreshToken', data.token.refreshToken, cookieOptions)
      .json({ message: 'Refresh token success.', data: { token: { accessToken: data.token.accessToken } } })
  })

  logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const familyId = req.cookies['familyToken']
    const userId = req.user?.userId as string
    await this.authService.logout(familyId, userId)
    res
      .clearCookie('familyToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .status(200)
      .json({ message: 'Logout success.' })
  })

  logoutAllDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId as string
    await this.authService.logoutAllDevice(userId)
    res
      .clearCookie('familyToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .status(200)
      .json({ message: 'Logout all success.' })
  })

  forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    await this.authService.forgotPassword(email)
    res.status(200).json({ message: 'Forgot password success. Please check your email' })
  })

  resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query
    const { password } = req.body
    await this.authService.resetPassword(token as string, password)
    res.status(200).json({ message: 'Reset password success. You can login now.' })
  })

  changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.userId as string
    const { oldPassword, newPassword } = req.body
    const data = await this.authService.changePassword(userId, oldPassword, newPassword)
    res.status(200).json({ message: 'Change password success.', data })
  })

  googleLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query

    const data = await this.authService.googleLogin(code as string)
    res
      .cookie('familyToken', data.token.familyToken, cookieOptions)
      .cookie('refreshToken', data.token.refreshToken, cookieOptions)
      .redirect(`http://localhost:5173/oauth-success?accessToken=${data.token.accessToken}`)
  })
}

export default AuthController
