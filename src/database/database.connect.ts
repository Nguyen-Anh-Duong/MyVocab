import mongoose from 'mongoose'
import { MONGO_DB_NAME, MONGO_URL } from '~/config/index.js'

const url: string = `${MONGO_URL}/${MONGO_DB_NAME}?authSource=admin`
const db = await mongoose
  .connect(url)
  .then(() => console.log('Connected to database!'))
  .catch((err: Error) => {
    console.log('Connection error: ', err)
    process.exit(1)
  })

export default db
