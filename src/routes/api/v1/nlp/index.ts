import Router from 'express'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import nlpController from '~/controllers/nlp.controller.js'

const nlpRouter = Router()

nlpRouter.post('/text-to-vocabulary', authenticateAccessToken, nlpController.parseTextToVocabulary)

export default nlpRouter
