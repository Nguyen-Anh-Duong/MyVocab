import { IsMongoId } from 'class-validator'

export class IdDto {
  @IsMongoId({ message: 'Invalid vocabulary ID.' })
  vocabId!: string
}
