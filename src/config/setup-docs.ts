import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export const setupDocs = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: '',
      type: 'http',
      bearerFormat: 'token',
    })
    .addTag('')
    .addTag('')
    .build();

  const openAPIObj: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, openAPIObj);
};
