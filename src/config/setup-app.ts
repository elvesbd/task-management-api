import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';

export const setupApp = (app: INestApplication): INestApplication => {
  app.use(helmet);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Access',
      'Accept',
      'Origin',
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  });

  return app;
};
