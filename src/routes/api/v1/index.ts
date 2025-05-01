import { Router } from 'express'
import authRouter from './auth/auth.route.js'

const v1Router = Router()

v1Router.use('/v1', authRouter)

export default v1Router
