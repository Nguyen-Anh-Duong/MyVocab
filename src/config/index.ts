import 'dotenv/config'

const PORT = process.env.PORT!

const NODE_ENV = process.env.NODE_ENV!
const APP_URL = process.env.APP_URL!

const MONGO_URL = process.env.MONGO_URL!
const MONGO_DB_NAME = process.env.MONGO_DB_NAME!
const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME!
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD!

const SALT_LENGTH = Number(process.env.SALT_LENGTH!)
const KEY_LENGTH = Number(process.env.KEY_LENGTH!)

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY!
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY!

const RESEND_API_KEY = process.env.RESEND_API_KEY!

export {
  PORT,
  NODE_ENV,
  MONGO_URL,
  MONGO_DB_NAME,
  SALT_LENGTH,
  KEY_LENGTH,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  RESEND_API_KEY,
  APP_URL
}
