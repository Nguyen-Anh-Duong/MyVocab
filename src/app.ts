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
if (NODE_ENV === 'dev') {
  app.use(
    cors({
      origin: [
        'http://localhost:5173', // Vite default dev server port
        'http://localhost:5174' // Alternative Vite port
      ],
      credentials: true, // Allow cookies to be sent
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )
}
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
