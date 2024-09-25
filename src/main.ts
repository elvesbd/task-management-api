import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { setupApp } from '@config/setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  setupApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3001;

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
