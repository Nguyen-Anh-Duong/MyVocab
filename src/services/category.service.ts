import { Types } from 'mongoose'
import { CreateCategoryDto, UpdateCategoryDto } from '~/dtos/category.dto.js'
import { CategoryModel } from '~/models/category.model.js'
import { VocabularyModel } from '~/models/vocabulary.model.js'
import { BadRequestError, NotFoundError } from '~/utils/Errors.js'

class CategoryService {
  createCategory = async (categoryData: CreateCategoryDto, userId: string) => {
    const { name, description } = categoryData

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
      createdBy: userId
    })

    await newCategory.save()
    return newCategory
  }

  getCategories = async (userId: string) => {
    const categories = await CategoryModel.find({ createdBy: userId }).lean()

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

  updateCategory = async (categoryId: string, updateData: UpdateCategoryDto, userId: string) => {
    const category = await CategoryModel.findOne({
      _id: categoryId,
      createdBy: userId
    })

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await CategoryModel.findOne({
        createdBy: userId,
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

    await category.save()
    return category
  }

  deleteCategory = async (categoryId: string, userId: string) => {
    const category = await CategoryModel.findOne({
      _id: categoryId,
      createdBy: userId
    })

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }

    // delete category of vocabularies
    await VocabularyModel.updateMany({ createdBy: userId }, { $pull: { categories: categoryId } })

    await CategoryModel.findByIdAndDelete(categoryId)
  }

  getVocabulariesByCategory = async (categoryId: string, userId: string, page = 1, limit = 10) => {
    const category = await CategoryModel.findOne({
      _id: categoryId,
      createdBy: userId
    })

    if (!category) {
      throw new NotFoundError({ message: 'Category not found' })
    }

    const skip = (page - 1) * limit

    const [vocabularies, total] = await Promise.all([
      VocabularyModel.find({
        categories: categoryId,
        createdBy: userId
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
        createdBy: userId
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
}

export default new CategoryService()
