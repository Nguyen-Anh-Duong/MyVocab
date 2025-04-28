import express from 'express'
import compression from 'compression'
import cors from 'cors'
import { connectDB } from './database/database.connect.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000
  })
)
// app.use(cors())

//connect to database
connectDB()

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('Response sent')
})

export default app
