import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Static fayllar uchun (Rasmlarni ko'rish uchun)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 2. Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }));

  // 3. Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Movie Portal API')
    .setDescription('Kinolar va Foydalanuvchilar boshqaruvi')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

    
  
  const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document, {
  swaggerOptions: {
    persistAuthorization: true, // Token yo'qolib qolmasligi uchun
  },
  });



  

  await app.listen(3000);
}
bootstrap();