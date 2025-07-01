import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PartOfSpeech } from '~/constants/enum.js'

export class SearchVocabularyDto {
  @IsString()
  word!: string
}
