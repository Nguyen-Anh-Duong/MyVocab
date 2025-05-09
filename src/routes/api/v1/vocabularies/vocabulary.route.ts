import { Router } from 'express'
import vocabularyController from '~/controllers/vocabulary.controller.js'
import { IdDto } from '~/dtos/id.dto.js'
import { CreateVocabularyDto, UpdateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'

const vocabRouter = Router()

vocabRouter.post('/', validateDto(CreateVocabularyDto), authenticateAccessToken, vocabularyController.createNewVocab)
vocabRouter.get(
  '/:vocabId',
  validateDto(IdDto, 'params'),
  authenticateAccessToken,
  vocabularyController.getOneVocabulary
)
vocabRouter.patch(
  '/:vocabId',
  validateDto(UpdateVocabularyDto),
  validateDto(IdDto, 'params'),
  authenticateAccessToken,
  vocabularyController.updateOneVocabulary
)

export default vocabRouter
