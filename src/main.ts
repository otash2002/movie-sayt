import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Movie App')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Bu ixtiyoriy, lekin JWT ekanini bildiradi
        name: 'JWT',
        description: 'Tokenni kiriting',
        in: 'header',
      },
      'access-token', // <--- BU NOMGA E'TIBOR BERING!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();