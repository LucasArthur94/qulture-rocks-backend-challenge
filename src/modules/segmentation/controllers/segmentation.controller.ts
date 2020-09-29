import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpException,
  Body,
  Logger,
  Param,
  Inject,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as Bluebird from 'bluebird'
import { Segmentation } from '../entities/segmentation.entity'
import { User } from '../entities/user.entity'
import { SegmentationUsersService } from '../services/segmentation-users.service'

type SegmentationsBody = {
  segmentations: Array<Omit<Segmentation, 'id' | 'createdAt' | 'updatedAt'>>
}

@Controller('segmentations')
export class SegmentationController {
  @Inject(SegmentationUsersService)
  private segmentationUsersService: SegmentationUsersService

  @InjectRepository(Segmentation)
  private segmentationsRepository: Repository<Segmentation>

  constructor(private logger: Logger) {}

  @Get(':segmentationId')
  async getSegmentation(
    @Param('segmentationId') segmentationId: string
  ): Promise<{
    segmentation: Segmentation
  }> {
    const segmentation = await this.segmentationsRepository.findOne({
      relations: ['parentSegmentation'],
      where: { id: Number(segmentationId) },
    })

    if (!segmentation) {
      throw new HttpException('segmentations not found', HttpStatus.NOT_FOUND)
    }

    return {
      segmentation,
    }
  }

  @Get(':segmentationId/users')
  async getUsers(
    @Param('segmentationId') segmentationId: string
  ): Promise<{
    users: User[]
  }> {
    const segmentations = await this.segmentationsRepository.find({
      relations: ['parentSegmentation'],
      where: [
        { id: Number(segmentationId) },
        { parentSegmentation: { id: Number(segmentationId) } },
      ],
    })

    const users = await Bluebird.reduce(
      segmentations,
      async (users: User[], segmentation) => [
        ...users,
        ...(await this.segmentationUsersService.getSegmentationUsers(
          segmentation
        )),
      ],
      []
    )

    return {
      users,
    }
  }

  @Post('/create')
  async createSegmentations(
    @Body() body: SegmentationsBody
  ): Promise<{ segmentationId: number }> {
    const { segmentations } = body

    const [mainSegmentation, ...otherSegmentations] = segmentations

    const parentSegmentation = await this.segmentationsRepository.save(
      mainSegmentation
    )

    await Bluebird.map(otherSegmentations, async (segmentation) =>
      this.segmentationsRepository.save({
        ...segmentation,
        parentSegmentation,
      })
    )

    return {
      segmentationId: parentSegmentation.id,
    }
  }
}
