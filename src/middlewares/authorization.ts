import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '~/utils/Errors.js'

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      const role = user!.role

      if (!roles.includes(role)) {
        throw new ForbiddenError({
          message: `Access denied. User role '${role}' is not authorized.`
        })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}
