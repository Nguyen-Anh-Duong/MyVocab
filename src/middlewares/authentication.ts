import { NextFunction, Request, Response } from 'express'
import redis from '~/database/redis.connect.js'
import { verifyAccessToken, verifyRefreshToken } from '~/services/token.service.js'
import { UnauthorizedError } from '~/utils/Errors.js'

export const authenticateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedError({ message: 'Missing token.' })
    }

    const decoded = await verifyAccessToken(token)

    req.user = decoded
    next()
  } catch (err) {
    next(err)
  }
}

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies['refreshToken']
    const familyId = req.cookies['familyToken']
    if (!refreshToken || !familyId) {
      throw new UnauthorizedError({ message: 'Missing cookie token.' })
    }

    // Verify the refresh token
    const decoded = await verifyRefreshToken(refreshToken)
    const tokenId = decoded.jti // Get the JWT ID from the decoded token

    const key = `refresh:${decoded.userId}:${familyId}`
    const latestToken = await redis.get(key)

    //check if refresh token is compromised
    if (!latestToken || latestToken !== tokenId) {
      //token is compromised, delete it
      await redis.del(key)
      throw new UnauthorizedError({ message: 'Invalid refresh token.' })
    }

    //token is valid, set user in request
    req.user = decoded
    next()
  } catch (err) {
    next(err)
  }
}
