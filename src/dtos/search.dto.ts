import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PartOfSpeech } from '~/constants/enum.js'

export class SearchVocabularyDto {
  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsString()
  meaning?: string

  @IsOptional()
  @IsString()
  example?: string

  @IsOptional()
  @IsString()
  phrase?: string

  @IsOptional()
  @IsEnum(PartOfSpeech)
  partOfSpeech?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  context?: string

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'word'

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc'

  @IsOptional()
  @IsString()
  page?: string

  @IsOptional()
  @IsString()
  limit?: string
}
