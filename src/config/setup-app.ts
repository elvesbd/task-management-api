import { INestApplication } from '@nestjs/common';

export const setupApp = (app: INestApplication): INestApplication => {
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
