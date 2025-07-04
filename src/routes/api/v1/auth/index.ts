import { Router } from 'express'
import AuthController from '~/controllers/auth.controller.js'
import { VerifyEmailDto } from '~/dtos/email.dto.js'
import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import { authenticateAccessToken, authenticateRefreshToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/register', validateDto(CreateUserDto), authController.register)

authRouter.post('/login', validateDto(LoginUserDto), authController.login)

authRouter.get('/verify-email', validateDto(VerifyEmailDto, 'query'), authController.verifyEmail)

authRouter.post('/refresh-token', authenticateRefreshToken, authController.refreshToken)

authRouter.post('/logout', authenticateAccessToken, authController.logout)

authRouter.post('/logout-all', authenticateAccessToken, authController.logoutAllDevice)

export default authRouter
