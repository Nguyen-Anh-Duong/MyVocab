import { Router } from 'express'
import authRouter from './auth/auth.route.js'
import userRouter from './users/user.route.js'
import vocabRouter from './vocabularies/vocabulary.route.js'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/users', userRouter)
v1Router.use('/vocabularies', vocabRouter)

export default v1Router
