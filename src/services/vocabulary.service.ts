import { Types } from 'mongoose'
import { CreateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { SearchVocabularyDto } from '~/dtos/search.dto.js'
import { CategoryModel } from '~/models/category.model.js'
import { VocabularyModel } from '~/models/vocabulary.model.js'
import { ForbiddenError, NotFoundError } from '~/utils/Errors.js'
import { Role } from '~/config/role.js'

class VocabularyService {
  createVocabulary = async (vocabData: CreateVocabularyDto, userId: string) => {
    //categories is array of string . e.g ["math", "physic"]
    //we search in category collection to find category named math and physic, if not found category named "math" , we will create new category "math"
    const { word, meanings, phonetic, categories } = vocabData
    let categoryIds: Types.ObjectId[] = []

    // if user send categories for new vocabulary in the request
    if (categories) {
      categoryIds = await Promise.all(
        categories.map(async (catName) => {
          const foundCategory = await CategoryModel.findOne({ createdBy: userId, name: catName })
          if (foundCategory) {
            //if catName found in category model, so userId created it, just return the id of category
            return foundCategory._id
          } else {
            //if not found, this is a new category, we will create it
            const newCate = new CategoryModel({ name: catName, createdBy: userId })
            await newCate.save()
            return newCate._id
          }
        })
      )
    }

    //create new vocabulary for user
    const newVocab = new VocabularyModel({ word, phonetic, meanings, categories: categoryIds, createdBy: userId })
    await newVocab.save()
    return newVocab
  }

  getVocabularies = async (user: IUserRequest) => {
    let queryFilter: Record<string, any> = {}
    if (user.role === Role.USER) {
      queryFilter.createdBy = user.userId // only get vocabularies created by the user
    }
    const vocabList = await VocabularyModel.find(queryFilter).sort({ createdAt: -1 }).lean()
    return vocabList
  }

  getOneVocabulary = async (vocabId: string, user: IUserRequest) => {
    const vocab = await VocabularyModel.findById(vocabId)
      .populate({
        path: 'categories',
        select: 'name _id'
      })
      .lean()
      .exec()

    if (!vocab) {
      throw new NotFoundError({ message: 'Not found vocabulary.' })
    }
    // if user is admin, they can access all vocabularies
    if (user.role === Role.USER && vocab.createdBy!.toString() !== user.userId) {
      throw new ForbiddenError({ message: 'Not permission.' }) // user can only access vocabularies created by them
    }

    return vocab
  }

  updateOneVocabulary = async (data: CreateVocabularyDto, user: IUserRequest, vocabId: string) => {
    let query: Record<string, any> = { _id: vocabId }
    if (user.role === Role.USER) {
      query.createdBy = user.userId // only get vocabularies created by the user
    }

    const vocab = await VocabularyModel.findById(vocabId)

    if (!vocab) {
      throw new NotFoundError({ message: 'Vocabulary not found' })
    }

    // if user is admin, they can access all vocabularies
    if (user.role === Role.USER && vocab.createdBy!.toString() !== user.userId) {
      throw new ForbiddenError({ message: 'Not permission' }) // user can only access vocabularies created by them
    }

    //update field
    if (data.word !== undefined) vocab.word = data.word
    if (data.phonetic !== undefined) vocab.phonetic = data.phonetic
    if (data.meanings !== undefined) vocab.meanings = data.meanings

    if (data.categories !== undefined) {
      // first we find exiting category from request
      const existingCategories = await CategoryModel.find({
        name: { $in: data.categories },
        createdBy: vocab.createdBy
      })

      const existingCategoryNames = existingCategories.map((c) => c.name)
      const existingCategoryIds = existingCategories.map((c) => c._id)

      // find all category that not belong to user. In this situation, we will create new category
      const newCategoryNames = data.categories.filter((name) => !existingCategoryNames.includes(name))

      const newCategoryDocs = await CategoryModel.insertMany(
        newCategoryNames.map((name) => ({
          name,
          createdBy: vocab.createdBy // ensure the category is created by owner of the vocabulary
        }))
      )

      //all categories belong to user now. Replace this with old categories field
      const allCategoryIds = [...existingCategoryIds, ...newCategoryDocs.map((doc) => doc._id)]

      //replaced the categories field with new category ids
      vocab.set('categories', allCategoryIds)
    }

    await vocab.save()
    return vocab
  }

  deleteOneVocabulary = async (vocabId: string, user: IUserRequest) => {
    const vocab = await VocabularyModel.findById(vocabId)
    if (!vocab) {
      throw new NotFoundError({ message: 'Vocabulary not found' })
    }

    // if user is admin, they can delete all vocabularies
    if (user.role === Role.USER && vocab.createdBy!.toString() !== user.userId) {
      throw new ForbiddenError({ message: 'Not permission' }) // user can only delete vocabularies created by them
    }
    // delete vocabulary
    await vocab.deleteOne()
  }

  searchVocabularies = async (word: string, user: IUserRequest) => {
    let query: Record<string, any> = { $text: { $search: word } }
    if (user.role === Role.USER) {
      query.createdBy = user.userId
    }
    const vocabularies = await VocabularyModel.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .lean()

    return vocabularies
  }
}
export default new VocabularyService()
