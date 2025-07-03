import { Router } from 'express'
import categoryController from '~/controllers/category.controller.js'
import { CreateCategoryDto, SearchCategoryDto, UpdateCategoryDto } from '~/dtos/category.dto.js'
import { CategoryIdDto, IdDto } from '~/dtos/id.dto.js'
import { authenticateAccessToken } from '~/middlewares/authentication.js'
import { validateDto } from '~/middlewares/validate.js'

const categoryRouter = Router()

// Category CRUD operations
categoryRouter.post('/', validateDto(CreateCategoryDto), authenticateAccessToken, categoryController.createCategory)
categoryRouter.get('/', authenticateAccessToken, categoryController.getCategories)
categoryRouter.get('/stats', authenticateAccessToken, categoryController.getCategoryStats)
// categoryRouter.get(
//   '/:categoryId',
//   validateDto(CategoryIdDto, 'params'),
//   authenticateAccessToken,
//   categoryController.getOneCategory
// )
categoryRouter.patch(
  '/:categoryId',
  validateDto(UpdateCategoryDto),
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  categoryController.updateCategory
)
categoryRouter.delete(
  '/:categoryId',
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  categoryController.deleteCategory
)

// Get vocabularies by category
categoryRouter.get(
  '/:categoryId/vocabularies',
  validateDto(CategoryIdDto, 'params'),
  authenticateAccessToken,
  categoryController.getVocabulariesByCategory
)

categoryRouter.get(
  '/search',
  validateDto(SearchCategoryDto, 'query'),
  authenticateAccessToken,
  categoryController.searchCategories
)

export default categoryRouter
