import { Module, Logger } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { config } from '../../config'

import { SnakeNamingStrategy } from '../common/snake-naming-strategy'
import { Tag } from './entities/tag.entity'
import { User } from './entities/user.entity'
import { Segmentation } from './entities/segmentation.entity'
import { TagController } from './controllers/tag.controller'
import { UserController } from './controllers/user.controller'
import { SegmentationController } from './controllers/segmentation.controller'
import { SegmentationUsersService } from './services/segmentation-users.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.postgres.url,
      entities: ['dist/**/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Tag, User, Segmentation]),
  ],
  controllers: [TagController, UserController, SegmentationController],
  exports: [TypeOrmModule],
  providers: [Logger, SegmentationUsersService],
})
export class SegmentationModule {}
