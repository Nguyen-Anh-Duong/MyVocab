import { Router } from 'express'
import { Role } from '~/config/role.js'
import userController from '~/controllers/user.controller.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { authorize } from '~/middlewares/authorization.js'
import { validateDto } from '~/middlewares/validate.js'
import { UserIdDto, UpdateUserDto, UpdateUserStatusDto } from '~/dtos/user.dto.js'

const userRouter = Router()

// Current user info (accessible by both admin and user)
userRouter.get('/me', authenticateAccessToken, authorize([Role.ADMIN, Role.USER]), userController.me)

// Admin only routes for user management
userRouter.get('/', authenticateAccessToken, authorize([Role.ADMIN]), userController.getAllUsers)

userRouter.get(
  '/:userId',
  validateDto(UserIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN]),
  userController.getUserById
)

userRouter.patch(
  '/:userId',
  validateDto(UpdateUserDto),
  validateDto(UserIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN]),
  userController.updateUser
)

userRouter.patch(
  '/:userId/status',
  validateDto(UpdateUserStatusDto),
  validateDto(UserIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN]),
  userController.updateUserStatus
)

userRouter.delete(
  '/:userId',
  validateDto(UserIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN]),
  userController.deleteUser
)

export default userRouter
