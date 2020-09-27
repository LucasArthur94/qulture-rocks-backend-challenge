import { Module } from '@nestjs/common'

import { SegmentationModule } from './modules/segmentation/segmentation.module'

@Module({
  imports: [SegmentationModule],
})
export class AppModule {}
