import { NextFunction, Router, Response, Request } from 'express'

const router = Router()

router.get('/user', (req: Request, res: Response, next: NextFunction) => {
  res.json({ x: 'ok' })
})
