import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateUserBody {
  @IsEmail()
  email: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsISO8601()
  birthDate: Date

  @IsISO8601()
  admissionDate: Date

  @IsBoolean()
  isActive: boolean

  @IsEnum(['male', 'female'])
  sex: 'male' | 'female'

  @IsISO8601()
  lastSignInAt: Date

  @IsInt({ each: true })
  tagIds: number[]
}

export class EditUserBody {
  @IsInt()
  id: number

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsISO8601()
  birthDate?: Date

  @IsOptional()
  @IsISO8601()
  admissionDate?: Date

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsEnum(['male', 'female'])
  sex?: 'male' | 'female'

  @IsOptional()
  @IsISO8601()
  lastSignInAt?: Date

  @IsOptional()
  @IsInt({ each: true })
  tagIds?: number[]
}

export class DeleteUserBody {
  @IsInt()
  id: number
}
