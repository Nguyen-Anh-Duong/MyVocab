import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ValidationError } from '~/utils/Errors.js'

export const validateDto = (dtoClass: any, source: 'body' | 'query' | 'params' = 'body'): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req[source] || {})
    const errors = await validate(instance)
    if (errors.length > 0) {
      const message = errors.map((err) => Object.values(err.constraints || {})).flat()
      const context = {
        fields: errors.map((err) => err.property),
        details: message
      }
      return next(
        new ValidationError({
          message: 'Invalid data',
          context,
          logging: false
        })
      )
    }
    req[source] = instance
    next()
  }
}
