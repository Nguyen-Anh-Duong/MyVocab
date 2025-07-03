import { Router } from 'express'
import authRouter from './auth/index.js'
import userRouter from './users/index.js'
import vocabRouter from './vocabularies/index.js'
import categoryRouter from './categories/index.js'

const v1Router = Router()

v1Router.use('/auth', authRouter)
v1Router.use('/users', userRouter)
v1Router.use('/vocabularies', vocabRouter)
v1Router.use('/categories', categoryRouter)

export default v1Router
