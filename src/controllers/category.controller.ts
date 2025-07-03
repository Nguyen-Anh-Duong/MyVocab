import { NextFunction, Request, Response } from 'express'
import { CreateCategoryDto, UpdateCategoryDto } from '~/dtos/category.dto.js'
import categoryService from '~/services/category.service.js'

class CategoryController {
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const categoryData: CreateCategoryDto = req.body
    const data = await categoryService.createCategory(categoryData, user.userId)
    res.status(201).json({ message: 'Create category successfully.', data })
  }

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const data = await categoryService.getCategories(user.userId)
    res.status(200).json({ message: 'Get categories successfully', data })
  }

  getOneCategory = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { categoryId } = req.params
    const data = await categoryService.getOneCategory(categoryId, user.userId)
    res.status(200).json({ message: 'Get category successfully', data })
  }

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { categoryId } = req.params
    const updateData: UpdateCategoryDto = req.body
    const data = await categoryService.updateCategory(categoryId, updateData, user.userId)
    res.status(200).json({ message: 'Update category successfully', data })
  }

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { categoryId } = req.params
    await categoryService.deleteCategory(categoryId, user.userId)
    res.status(200).json({ message: 'Delete category successfully' })
  }

  getVocabulariesByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { categoryId } = req.params
    const { page = '1', limit = '10' } = req.query
    const data = await categoryService.getVocabulariesByCategory(
      categoryId,
      user.userId,
      parseInt(page as string),
      parseInt(limit as string)
    )
    res.status(200).json({ message: 'Get vocabularies by category successfully', data })
  }

  getCategoryStats = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const data = await categoryService.getCategoryStats(user.userId)
    res.status(200).json({ message: 'Get category statistics successfully', data })
  }

  searchCategories = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUserRequest
    const { q } = req.query
    const data = await categoryService.searchCategories(q as string, user.userId)
    res.status(200).json({ message: 'Search categories successfully', data })
  }
}

export default new CategoryController()
