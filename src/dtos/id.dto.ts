import { IsMongoId } from 'class-validator'

export class IdDto {
  @IsMongoId({ message: 'Invalid vocabulary ID.' })
  vocabId!: string
}

export class CategoryIdDto {
  @IsMongoId({ message: 'Invalid category ID.' })
  categoryId!: string
}
