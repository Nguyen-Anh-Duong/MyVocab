import { NextFunction, Request, Response, Router } from 'express'
import { authenticateAccessToken } from '~/middlewares/authentication.js'

const userRouter = Router()

userRouter.get('/users', authenticateAccessToken, (req: Request, res: Response, next: NextFunction) => {
  res.send('okffff')
})

export default userRouter
