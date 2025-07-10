import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from 'data-source/data-source';
import { HttpExceptionFilter } from '../custom-validate/http-exception.filter';
import * as dotenv from 'dotenv';
dotenv.config();
import { join } from 'path';

async function bootstrap() {
  await AppDataSource.initialize(); // init koneksi DB

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // ⬅️ ini penting
  app.useGlobalFilters(new HttpExceptionFilter());

  console.log('Public path:', join(__dirname, '..', 'public')); // ⬅️ ini dia log-nya

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
