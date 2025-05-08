import { NextFunction, Request, Response } from 'express'
import { CreateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import vocabularyService from '~/services/vocabulary.service.js'

class VocabularyController {
  createNewVocab = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const vocab: CreateVocabularyDto = req.body
    const data = await vocabularyService.createVocabulary(vocab, user?.userId)
    res.status(200).json(data)
  }
}

export default new VocabularyController()
