import { Router } from 'express'
import { Role } from '~/config/role.js'
import userController from '~/controllers/user.controller.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { authorize } from '~/middlewares/authorization.js'

const userRouter = Router()

userRouter.get('/me', authenticateAccessToken, authorize([Role.ADMIN, Role.USER]), userController.me)

export default userRouter
