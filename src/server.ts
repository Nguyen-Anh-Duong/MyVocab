import app from './index.js'
import 'dotenv/config'

const port = process.env.PORT || '3000'

app.listen(port, () => {
  console.log(`MyVocab listening on port ${port}`)
})
