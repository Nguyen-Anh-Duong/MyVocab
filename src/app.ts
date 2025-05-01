import express from 'express'
import compression from 'compression'
import cors from 'cors'
import 'reflect-metadata'
import { connectDB } from './database/database.connect.js'
import router from './routes/index.js'
import morgan from 'morgan'
import helmet from 'helmet'

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

app.use(router)

export default app
