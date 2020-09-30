import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { config } from './config'
import { Logger, LoggingInterceptor } from './logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  })
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(config.port)
}
bootstrap()
