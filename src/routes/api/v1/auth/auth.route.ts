import { Router } from 'express'
import AuthController from '~/controllers/auth.controller.js'
import { VerifyEmailDto } from '~/dtos/email.dto.js'
import { CreateUserDto, LoginUserDto } from '~/dtos/user.dto.js'
import { validateDto } from '~/middlewares/validate.js'

const authRouter = Router()
const authController = new AuthController()

authRouter.post('/register', validateDto(CreateUserDto), authController.register)
authRouter.post('/login', validateDto(LoginUserDto), authController.login)
authRouter.post('/verify-email', validateDto(VerifyEmailDto, 'query'), authController.verifyEmail)

export default authRouter
