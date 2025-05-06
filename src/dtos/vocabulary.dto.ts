import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { PartOfSpeech } from '~/constants/enum.js'

class ExampleDto {
  @IsString()
  sentence!: string

  @IsString()
  @IsOptional()
  translation?: string
}

class CommonPhrasesDto {
  @IsString()
  phrase!: string

  @IsString()
  @IsOptional()
  meaning!: string
}

class MeaningDto {
  @IsString()
  meaning!: string

  @IsString()
  @IsOptional()
  context?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExampleDto)
  examples?: ExampleDto[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommonPhrasesDto)
  commonPhrases?: CommonPhrasesDto[]

  @IsOptional()
  @IsEnum(PartOfSpeech)
  partOfSpeech?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class CreateVocabularyDto {
  @IsString()
  word!: string

  @IsOptional()
  phonetic?: {
    text?: string
    audio?: string
  }

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeaningDto)
  meanings!: MeaningDto[]

  @IsOptional()
  @IsString()
  category?: string
}
