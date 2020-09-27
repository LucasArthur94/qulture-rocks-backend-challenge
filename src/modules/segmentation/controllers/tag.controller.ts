import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Put,
  Logger,
  Param,
  Delete,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from '../entities/tag.entity'

export type TagsResponse = {
  tags: Tag[]
}

export type TagResponse = {
  tag: Tag
}

@Controller('tags')
export class TagController {
  @InjectRepository(Tag)
  private tagsRepository: Repository<Tag>

  constructor(private logger: Logger) {}

  @Get()
  async getTags(): Promise<TagsResponse> {
    const tags = await this.tagsRepository.find()

    return {
      tags,
    }
  }

  @Get(':tagId')
  async getTag(@Param('tagId') tagId: string): Promise<TagResponse> {
    const tag = await this.tagsRepository.findOne({ id: Number(tagId) })

    if (!tag) {
      throw new HttpException('Tags not found', HttpStatus.NOT_FOUND)
    }

    return {
      tag,
    }
  }

  @Post()
  async createTag(@Body() body: { name: string }): Promise<TagResponse> {
    const { name } = body

    const tag = await this.tagsRepository.save({
      name,
    })

    return {
      tag,
    }
  }

  @Put()
  async editTag(
    @Body() body: { id: number; name: string }
  ): Promise<TagResponse> {
    const { id, name } = body

    const tag = await this.tagsRepository.findOne(id)

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND)
    }

    const existentTag = await this.tagsRepository.findOne({ where: { name } })

    if (existentTag) {
      this.logger.log('Tag already exists')

      return {
        tag: existentTag,
      }
    }

    const updatedTag = await this.tagsRepository.save({
      ...tag,
      name: name || tag.name,
    })

    return {
      tag: updatedTag,
    }
  }

  @Delete()
  async deleteTag(@Body() body: { id: number }): Promise<{ success: true }> {
    const { id } = body

    await this.tagsRepository.delete(id)

    return {
      success: true,
    }
  }
}
