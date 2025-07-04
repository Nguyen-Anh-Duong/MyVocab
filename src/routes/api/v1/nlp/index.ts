import Router from 'express'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import nlpController from '~/controllers/nlp.controller.js'
import { authorize } from '~/middlewares/authorization.js'
import { Role } from '~/config/role.js'

const nlpRouter = Router()

nlpRouter.post(
  '/text-to-vocabulary',
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  nlpController.parseTextToVocabulary
)

export default nlpRouter
