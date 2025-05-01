import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, Request, RequestHandler, Response } from 'express'

export const validateDto = (dtoClass: any, source: 'body' | 'query' | 'params' = 'body'): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req[source])
    const errors = await validate(instance)
    if (errors.length > 0) {
      const message = errors.map((err) => Object.values(err.constraints || {})).flat()
      res.status(400).json({ message })
    }
    req[source] = instance
    next()
  }
}
