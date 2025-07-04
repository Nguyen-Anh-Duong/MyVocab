import { Router } from 'express'
import categoryController from '~/controllers/category.controller.js'
import { CategoryIdDto } from '~/dtos/id.dto.js'
import { CreateCategoryDto, UpdateCategoryDto, SearchCategoryDto } from '~/dtos/category.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'
import { authorize } from '~/middlewares/authorization.js'
import { Role } from '~/config/role.js'

const categoryRouter = Router()

categoryRouter.get(
  '/search',
  validateDto(SearchCategoryDto, 'query'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.searchCategories
)

categoryRouter.get(
  '/stats',
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.getCategoryStats
)

categoryRouter.get(
  '/:categoryId/vocabularies',
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.getVocabulariesByCategory
)

categoryRouter.post(
  '/',
  validateDto(CreateCategoryDto),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.createCategory
)

categoryRouter.patch(
  '/:categoryId',
  validateDto(UpdateCategoryDto),
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.updateCategory
)

categoryRouter.delete(
  '/:categoryId',
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  authorize([Role.ADMIN, Role.USER]),
  categoryController.deleteCategory
)

categoryRouter.get('/', authenticateAccessToken, authorize([Role.ADMIN, Role.USER]), categoryController.getCategories)

export default categoryRouter
