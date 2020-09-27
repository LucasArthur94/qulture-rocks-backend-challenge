import { Module, Logger } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { config } from '../../config'

import { SnakeNamingStrategy } from '../common/snake-naming-strategy'
import { Tag } from './entities/tag.entity'
import { User } from './entities/user.entity'
import { TagController } from './controllers/tag.controller'
import { UserController } from './controllers/user.controller'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.postgres.url,
      entities: ['dist/**/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Tag, User]),
  ],
  controllers: [TagController, UserController],
  exports: [TypeOrmModule],
  providers: [Logger],
})
export class SegmentationModule {}
