import { Router } from 'express'
import vocabularyController from '~/controllers/vocabulary.controller.js'
import { CreateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'

const vocabRouter = Router()

vocabRouter.post('/', validateDto(CreateVocabularyDto), authenticateAccessToken, vocabularyController.createNewVocab)

export default vocabRouter
