import { createClient } from 'redis'
import { REDIS_URL } from '~/config/index.js'

const redisUrl = REDIS_URL

const redis = createClient({
  url: redisUrl
})
redis.on('error', (err) => console.log('Redis client error', err))

// ;(async () => {
//   await redis.connect()
// })()
await redis.connect().then(() => console.log('Connected to Redis'))

export default redis
