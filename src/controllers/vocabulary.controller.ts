import { NextFunction, Request, Response } from 'express'
import { CreateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { SearchVocabularyDto } from '~/dtos/search.dto.js'
import vocabularyService from '~/services/vocabulary.service.js'

class VocabularyController {
  createNewVocab = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const vocab: CreateVocabularyDto = req.body
    const data = await vocabularyService.createVocabulary(vocab, user?.userId)
    res.status(200).json({ message: 'Create new vocabulary successfully.', data })
  }

  getOneVocabulary = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { vocabId } = req.params
    const data = await vocabularyService.getOneVocabulary(vocabId, user)
    res.status(200).json({ message: 'Get one vocabulary successfully', data })
  }

  getVocabularies = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const data = await vocabularyService.getVocabularies(user)
    res.status(200).json({ message: 'Get all vocabulary successfully', data })
  }

  updateOneVocabulary = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { vocabId } = req.params
    const dataUpdate = req.body
    const data = await vocabularyService.updateOneVocabulary(dataUpdate, user, vocabId)
    res.status(200).json({ message: 'Update vocabulary successfully', data })
  }

  deleteOneVocabulary = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { vocabId } = req.params
    await vocabularyService.deleteOneVocabulary(vocabId, user)
    res.status(200).json({ message: 'Delete vocabulary successfully' })
  }

  searchVocabularies = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { word } = req.query as unknown as SearchVocabularyDto
    const result = await vocabularyService.searchVocabularies(word, user)
    res.status(200).json({
      message: 'Search vocabularies successfully',
      data: result
    })
  }
}

export default new VocabularyController()
