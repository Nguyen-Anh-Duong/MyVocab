import express from 'express'
import compression from 'compression'
import cors from 'cors'
import 'reflect-metadata'
import router from './routes/index.js'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js'
import { NODE_ENV } from './config/index.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000
  })
)
app.use(cors())
app.use(helmet())
if (NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}
app.use(cookieParser())

//connect to database
import('./database/database.connect.js')
import('~/database/redis.connect.js')

app.get('/', (req, res, next) => {
  res.send('hello')
})

app.use(router)
app.use(errorHandler)

export default app
