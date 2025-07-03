import { Router } from 'express'
import userController from '~/controllers/user.controller.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'

const userRouter = Router()

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get user info successfully."
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.get('/me', authenticateAccessToken, userController.me)

export default userRouter
