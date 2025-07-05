import { Router } from 'express'
import AuthController from '~/controllers/auth.controller.js'
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  TokenDto,
  ResendVerificationEmailDto
} from '~/dtos/auth.dto.js'
import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import { authenticateAccessToken, authenticateRefreshToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'
import googleRouter from './google/index.js'

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/register', validateDto(CreateUserDto), authController.register)

authRouter.post('/login', validateDto(LoginUserDto), authController.login)

authRouter.get('/verify-email', validateDto(TokenDto, 'query'), authController.verifyEmail)

authRouter.post('/resend-verification', validateDto(ResendVerificationEmailDto), authController.resendVerificationEmail)

authRouter.post('/refresh-token', authenticateRefreshToken, authController.refreshToken)

authRouter.post('/logout', authenticateAccessToken, authController.logout)

authRouter.post('/logout-all', authenticateAccessToken, authController.logoutAllDevice)

authRouter.post('/forgot-password', validateDto(ForgotPasswordDto), authController.forgotPassword)

authRouter.post(
  '/reset-password',
  validateDto(TokenDto, 'query'),
  validateDto(ResetPasswordDto),
  authController.resetPassword
)

authRouter.post(
  '/change-password',
  validateDto(ChangePasswordDto),
  authenticateAccessToken,
  authController.changePassword
)

authRouter.use('/google', googleRouter)

export default authRouter
