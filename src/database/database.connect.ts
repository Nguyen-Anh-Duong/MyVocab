import 'dotenv/config'
import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  const url: string = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test'
  await mongoose
    .connect(url)
    .then(() => console.log('Connected to database!'))
    .catch((err: Error) => {
      console.log('Connection error: ', err)
      process.exit(1)
    })
}
