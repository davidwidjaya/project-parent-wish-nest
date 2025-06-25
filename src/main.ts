import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from 'data-source/data-source';
import { HttpExceptionFilter } from '../custom-validate/http-exception.filter';

async function bootstrap() {
  await AppDataSource.initialize(); // init koneksi DB

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // ⬅️ ini penting
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
