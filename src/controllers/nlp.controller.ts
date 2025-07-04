import { Request, Response, NextFunction } from 'express'
import nlpService from '~/services/nlp.service.js'
import { catchAsync } from '~/utils/catchAsync.js'
import { BadRequestError } from '~/utils/Errors.js'

class NlpController {
  parseTextToVocabulary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body
    if (!text || typeof text !== 'string') {
      throw new BadRequestError({ message: 'Invalid input. Please provide a valid text.' })
    }
    const vocabulary = await nlpService.parseTextToVocabulary(text)
    res.status(200).json({ message: 'Text parsed to vocabulary successfully.', data: vocabulary })
  })
}

export default new NlpController()
