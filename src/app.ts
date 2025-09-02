import express from 'express'
import compression from 'compression'
import cors from 'cors'
import 'reflect-metadata'
import router from './routes/index.js'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js'
import { FRONTEND_URL, NODE_ENV } from './config/index.js'
import { specs, swaggerUi } from './config/swagger.js'

// Import swagger documentation files to ensure they are loaded
import './docs/swagger/index.ts'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000
  })
)

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use(helmet())
if (NODE_ENV === 'dev') {
  app.use(morgan('dev'))
}
app.use(cookieParser())

//connect to database
import('./database/database.connect.js')
import('~/database/redis.connect.js')

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MyVocab API Documentation',
    swaggerOptions: {
      persistAuthorization: true
    }
  })
)

app.get('/', (req, res, next) => {
  res.send('MyVocab API Server - Visit /api-docs for API documentation')
})

app.use(router)
app.use(errorHandler)

export default app
