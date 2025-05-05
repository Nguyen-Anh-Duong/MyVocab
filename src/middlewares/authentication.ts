import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '~/services/token.service.js'
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
