import { Router } from 'express'
import vocabularyController from '~/controllers/vocabulary.controller.js'
import { VocabIdDto } from '~/dtos/id.dto.js'
import { CreateVocabularyDto, UpdateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { SearchVocabularyDto } from '~/dtos/search.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'
import { authorize } from '~/middlewares/authorization.js'
import { Role } from '~/config/role.js'

const vocabRouter = Router()

vocabRouter.get(
  '/search',
  validateDto(SearchVocabularyDto, 'query'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  vocabularyController.searchVocabularies
)

vocabRouter.post(
  '/',
  validateDto(CreateVocabularyDto),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  vocabularyController.createNewVocab
)

vocabRouter.get(
  '/:vocabId',
  validateDto(VocabIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  vocabularyController.getOneVocabulary
)

vocabRouter.patch(
  '/:vocabId',
  validateDto(UpdateVocabularyDto),
  validateDto(VocabIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  vocabularyController.updateOneVocabulary
)

vocabRouter.delete(
  '/:vocabId',
  validateDto(VocabIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  vocabularyController.deleteOneVocabulary
)

vocabRouter.get('/', authenticateAccessToken, authorize([Role.ADMIN, Role.USER]), vocabularyController.getVocabularies)

export default vocabRouter
