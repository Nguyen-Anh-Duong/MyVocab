import { Router } from 'express'
import userController from '~/controllers/user.controller.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'

const userRouter = Router()

userRouter.get('/me', authenticateAccessToken, userController.me)

export default userRouter
