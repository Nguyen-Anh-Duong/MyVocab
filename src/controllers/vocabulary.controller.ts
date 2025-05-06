import { NextFunction, Request, Response } from 'express'

class VocabularyController {
  createNewVocab = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const data = user
    res.status(200).json(data)
  }
}

export default new VocabularyController()
