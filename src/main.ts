import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Kino Sayt API')
    .setDescription('Kino platformasi uchun API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth() // JWT token bilan ishlash uchun
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 'api' manzili orqali kiriladi

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();