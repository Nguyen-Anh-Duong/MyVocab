import express from 'express'
import compression from 'compression'
import cors from 'cors'
import 'reflect-metadata'
import { connectDB } from './database/database.connect.js'
import router from './routes/index.js'
import morgan from 'morgan'
import helmet from 'helmet'
import { errorHandler } from './middlewares/errorHandler.js'
import { connectRedis } from './database/redis.connect.js'

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
app.use(morgan('dev'))
app.use(helmet())

//connect to database
connectDB()
connectRedis().then(() => console.log('Connect redis'))

app.get('/', (req, res, next) => {
  res.send('hello')
})

app.use(router)
app.use(errorHandler)

export default app
