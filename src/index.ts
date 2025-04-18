import express from 'express'
import compression from 'compression'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || '3000'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000
  })
)
// app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('Response sent')
})

app.listen(port, () => {
  console.log(`MyVocab listening on port ${port}`)
})
