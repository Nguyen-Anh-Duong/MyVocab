import { Types } from 'mongoose'
import { CreateVocabularyDto, MeaningDto } from '~/dtos/vocabulary.dto.js'
import { CategoryModel } from '~/models/category.model.js'
import { VocabularyModel } from '~/models/vocabulary.model.js'

class VocabularyService {
  createVocabulary = async (vocabData: CreateVocabularyDto, userId: string) => {
    const { word, meanings, phonetic, categories } = vocabData
    let categoryIds: Types.ObjectId[] = []
    // if user set categories for new vocabulary
    if (categories) {
      categoryIds = await Promise.all(
        categories.map(async (catName) => {
          const foundCategory = await CategoryModel.findOne({ createdBy: userId, name: catName })
          if (foundCategory) {
            //if catName found in category model, so userId created it
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

    const newVocab = new VocabularyModel({ word, phonetic, meanings, categories: categoryIds, createdBy: userId })
    await newVocab.save()
    return newVocab
  }
}

export default new VocabularyService()
