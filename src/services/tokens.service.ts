import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET_KEY } from '~/config/index.js'

export const generateAccessToken = (user: IUser): Promise<string> => {
  const payload = {
    userId: user._id,
    role: user.role
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '15m', jwtid: '123' }, (err, encoded) => {
      if (err) reject(err)
      else resolve(encoded as string)
    })
  })
}
