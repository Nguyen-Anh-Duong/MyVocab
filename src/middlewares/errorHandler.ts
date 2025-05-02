import { NextFunction, Response, Request, ErrorRequestHandler } from 'express'
import { CustomError } from '~/utils/Errors.js'

export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors, logging } = err
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: err.statusCode,
            errors: err.errors,
            stack: err.stack
          },
          null,
          2
        )
      )
    }
    res.status(statusCode).json({ errors })
    return
  }
  // Unhandled errors
  console.error(JSON.stringify(err, null, 2))
  res.status(500).json({ errors: [{ message: 'Something went wrong' }] })
  return
}
