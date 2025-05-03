import { createClient } from 'redis'

export const connectRedis = async () => {
  await createClient()
    .on('error', (err) => console.log('Redid client error', err))
    .connect()
}
