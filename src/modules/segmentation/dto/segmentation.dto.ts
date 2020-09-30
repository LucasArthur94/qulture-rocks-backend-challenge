import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class SegmentationBody {
  @IsOptional()
  @IsISO8601()
  birthDateBefore?: Date

  @IsOptional()
  @IsISO8601()
  birthDateAfter?: Date

  @IsOptional()
  @IsISO8601()
  admissionDateBefore?: Date

  @IsOptional()
  @IsISO8601()
  admissionDateAfter?: Date

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(['male', 'female'])
  sex?: 'male' | 'female'

  @IsOptional()
  @IsISO8601()
  lastSignInDateBefore?: Date

  @IsOptional()
  @IsISO8601()
  lastSignInDateAfter?: Date

  @IsOptional()
  @IsInt()
  tagId?: number
}

export class CreateSegmentationsBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SegmentationBody)
  segmentations: SegmentationBody[]
}

export class DeleteSegmentationBody {
  @IsInt()
  id: number
}
