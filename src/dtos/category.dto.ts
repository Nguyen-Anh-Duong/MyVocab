import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string
}

export class SearchCategoryDto {
  @IsString()
  q!: string

  @IsOptional()
  @IsNumber()
  page?: number

  @IsOptional()
  @IsNumber()
  limit?: number
}
