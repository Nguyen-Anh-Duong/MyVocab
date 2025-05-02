import app from './app.js'
import { MONGO_DB_NAME, PORT } from './config/index.js'

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
