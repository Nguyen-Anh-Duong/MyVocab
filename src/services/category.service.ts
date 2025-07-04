import { Types } from 'mongoose'
import { Role } from '~/config/role.js'
import { CreateCategoryDto, UpdateCategoryDto } from '~/dtos/category.dto.js'
import { CategoryModel } from '~/models/category.model.js'
import { VocabularyModel } from '~/models/vocabulary.model.js'
import { BadRequestError, ForbiddenError, NotFoundError } from '~/utils/Errors.js'

class CategoryService {
  createCategory = async (categoryData: CreateCategoryDto, userId: string) => {
    const { name, description, color } = categoryData

    // Check if category with same name already exists for this user
    const existingCategory = await CategoryModel.findOne({
      createdBy: userId,
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    })

    if (existingCategory) {
      throw new BadRequestError({ message: 'Category with this name already exists' })
    }

    const newCategory = new CategoryModel({
      name,
      description,
      color,
      createdBy: userId
    })

    await newCategory.save()
    return newCategory
  }

  getCategories = async (user: IUserRequest) => {
    let queryFilter: Record<string, any> = {}
    if (user.role === Role.USER) {
      queryFilter.createdBy = user.userId // only get vocabularies created by the user
    }
    const categories = await CategoryModel.find(queryFilter).lean()

    return categories
  }

  // co the bo di
  getOneCategory = async (categoryId: string, userId: string) => {
    const category = await CategoryModel.findOne({
      _id: categoryId,
      createdBy: userId
    })
      .populate({
        path: 'vocabularies',
        select: 'word phonetic meanings createdAt'
      })
      .lean()

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }

    return category
  }

  updateCategory = async (categoryId: string, updateData: UpdateCategoryDto, user: IUserRequest) => {
    const category = await CategoryModel.findById(categoryId)

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }
    if (user.role === Role.USER && category.createdBy.toString() !== user.userId) {
      throw new ForbiddenError({ message: 'Not permission' })
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await CategoryModel.findOne({
        createdBy: category.createdBy,
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: categoryId }
      })

      if (existingCategory) {
        throw new BadRequestError({ message: 'Category with this name already exists' })
      }
    }

    // Update fields
    if (updateData.name !== undefined) category.name = updateData.name
    if (updateData.description !== undefined) category.description = updateData.description
    if (updateData.color !== undefined) category.color = updateData.color

    await category.save()
    return category
  }

  deleteCategory = async (categoryId: string, user: IUserRequest) => {
    const category = await CategoryModel.findById(categoryId)

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }
    if (user.role === Role.USER && category.createdBy.toString() !== user.userId) {
      throw new ForbiddenError({ message: 'Not permission' })
    }

    // delete category of vocabularies
    await VocabularyModel.updateMany({ createdBy: category.createdBy }, { $pull: { categories: categoryId } })

    await category.deleteOne()
  }

  getVocabulariesByCategory = async (categoryId: string, user: IUserRequest, page = 1, limit = 10) => {
    const category = await CategoryModel.findById(categoryId)

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }

    const skip = (page - 1) * limit

    const [vocabularies, total] = await Promise.all([
      VocabularyModel.find({
        categories: categoryId,
        createdBy: category.createdBy
      })
        .populate({
          path: 'categories',
          select: 'name _id'
        })
        .sort({ createdAt: -1 })
        // .skip(skip)
        // .limit(limit)
        .lean(),
      VocabularyModel.countDocuments({
        categories: categoryId,
        createdBy: category.createdBy
      })
    ])

    return {
      category,
      vocabularies
      // pagination: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    }
  }

  getCategoryStats = async (userId: string) => {
    const categories = await CategoryModel.find({ createdBy: userId }).lean()

    const stats = await Promise.all(
      categories.map(async (category) => {
        const vocabCount = await VocabularyModel.countDocuments({
          categories: category._id,
          createdBy: userId
        })

        return {
          ...category,
          vocabularyCount: vocabCount
        }
      })
    )

    return stats
  }

  searchCategories = async (query: string, user: IUserRequest, page = 1, limit = 10) => {
    const skip = (page - 1) * limit

    const regex = new RegExp(query, 'i')
    let queryFilter: Record<string, any> = { name: { $regex: regex } }
    if (user.role === Role.USER) {
      queryFilter.createdBy = user.userId // only get categories created by the user
    }

    const [categories, total] = await Promise.all([
      CategoryModel.find(queryFilter)
        // .skip(skip)
        // .limit(limit)
        .lean(),
      CategoryModel.countDocuments(queryFilter)
    ])

    return {
      categories
      // pagination: {
      //   total,
      //   page,
      //   limit,
      //   totalPages: Math.ceil(total / limit)
      // }
    }
  }
}

export default new CategoryService()
