import { Logger, Injectable } from '@nestjs/common'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Segmentation } from '../entities/segmentation.entity'
import { User } from '../entities/user.entity'
import { Tag } from '../entities/tag.entity'
import { queryBuilder } from '../logic/query-builder'

@Injectable()
export class SegmentationUsersService {
  @InjectRepository(Tag)
  private tagsRepository: Repository<Tag>

  @InjectRepository(User)
  private usersRepository: Repository<User>

  constructor(private logger: Logger) {}

  async getSegmentationUsers(segmentation: Segmentation): Promise<User[]> {
    const query = queryBuilder(segmentation)

    const users = await this.usersRepository.find({
      relations: ['tags'],
      where: query,
    })

    const segmentationTagId = segmentation.tagId

    return segmentationTagId
      ? users.filter((user) =>
          user.tags.some((tag) => tag.id === segmentationTagId)
        )
      : users
  }
}
