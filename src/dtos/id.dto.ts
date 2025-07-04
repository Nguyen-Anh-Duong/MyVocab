import { IsMongoId } from 'class-validator'

export class VocabIdDto {
  @IsMongoId({ message: 'Invalid vocabulary ID.' })
  vocabId!: string
}

export class CategoryIdDto {
  @IsMongoId({ message: 'Invalid category ID.' })
  categoryId!: string
}
