import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export const setupDocs = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('')
    .setDescription('')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token no formato: Bearer <seu_token_aqui>',
    })
    .addTag('')
    .addTag('')
    .build();

  const openAPIObj: OpenAPIObject = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, openAPIObj);
};
