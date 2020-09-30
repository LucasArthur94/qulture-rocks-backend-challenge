import { IsInt, IsString } from 'class-validator'

export class CreateTagBody {
  @IsString()
  name: string
}

export class EditTagBody {
  @IsInt()
  id: number

  @IsString()
  name: string
}

export class DeleteTagBody {
  @IsInt()
  id: number
}
