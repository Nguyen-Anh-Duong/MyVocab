import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '~/config/index.js'
import { UnauthorizedError } from '~/utils/Errors.js'

export const generateAccessToken = (user: IUser): Promise<string> => {
  const payload = {
    userId: user._id,
    role: user.role
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1m' }, (err, encoded) => {
      if (err) reject(err)
      else resolve(encoded as string)
    })
  })
}

export const generateRefreshToken = (user: IUser): Promise<any> => {
  const payload = {
    userId: user._id,
    role: user.role
  }
  return new Promise((resolve, reject) => {
    const tokenId = crypto.randomUUID() // generate a unique token ID
    jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d', jwtid: tokenId }, (err, encoded) => {
      if (err) reject(err)
      else resolve({ encoded, tokenId })
    })
  })
}

export const verifyAccessToken = (accessToken: string): Promise<IUserRequest> => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) reject(new UnauthorizedError({ message: 'Invalid access token.' }))
      else resolve(decoded as IUserRequest)
    })
  })
}

export const verifyRefreshToken = (refreshToken: string): Promise<IUserRequest> => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) reject(new UnauthorizedError({ message: 'Invalid access token.' }))
      else resolve(decoded as IUserRequest)
    })
  })
}
