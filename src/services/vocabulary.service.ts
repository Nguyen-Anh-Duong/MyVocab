import { Types } from 'mongoose'
import { CreateVocabularyDto } from '~/dtos/vocabulary.dto.js'
import { CategoryModel } from '~/models/category.model.js'
import { VocabularyModel } from '~/models/vocabulary.model.js'
import { NotFoundError } from '~/utils/Errors.js'

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

  // getAllVocabByUserId = async (userId: string) => {
  //   const vocabList = await VocabularyModel.find({ createdBy: userId })

  // }

  getOneVocabulary = async (vocabId: string, userId: string) => {
    const vocab = await VocabularyModel.findOne({ _id: vocabId, createdBy: userId })
      .populate({
        path: 'categories',
        select: 'name _id' // only take name and id
      })
      .lean()

    if (!vocab) {
      throw new NotFoundError({ message: 'Not found vocabulary.' })
    }

    return vocab
  }

  updateOneVocabulary = async (data: CreateVocabularyDto, userId: string, vocabId: string) => {
    const vocab = await VocabularyModel.findOne({
      _id: vocabId,
      createdBy: userId
    })

    if (!vocab) {
      throw new NotFoundError({ message: 'Vocabulary not found' })
    }

    //update field
    if (data.word !== undefined) vocab.word = data.word
    if (data.phonetic !== undefined) vocab.phonetic = data.phonetic
    if (data.meanings !== undefined) vocab.meanings = data.meanings

    if (data.categories !== undefined) {
      // first we find exiting category from request
      const existingCategories = await CategoryModel.find({
        name: { $in: data.categories },
        createdBy: userId
      })

      const existingCategoryNames = existingCategories.map((c) => c.name)
      const existingCategoryIds = existingCategories.map((c) => c._id)

      // find all category that not belong to user. In this situation, we will create new category
      const newCategoryNames = data.categories.filter((name) => !existingCategoryNames.includes(name))

      const newCategoryDocs = await CategoryModel.insertMany(
        newCategoryNames.map((name) => ({
          name,
          createdBy: new Types.ObjectId(userId)
        }))
      )

      //all categories belong to user now. Replace this with old categories field
      const allCategoryIds = [...existingCategoryIds, ...newCategoryDocs.map((doc) => doc._id)]

      //replaced
      vocab.categories = allCategoryIds as unknown as typeof vocab.categories
    }

    await vocab.save()
    return vocab
  }
}

export default new VocabularyService()
