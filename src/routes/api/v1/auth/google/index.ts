import Router from 'express'
import { NextFunction, Request, Response } from 'express'
import { CLIENT_ID, REDIRECT_URI } from '~/config/index.js'
import AuthController from '~/controllers/auth.controller.js'

const googleRouter = Router()
const authController = new AuthController()

googleRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`
  // res.redirect(url)
  res.status(200).json({ url })
})

googleRouter.get('/callback', authController.googleLogin)

export default googleRouter
