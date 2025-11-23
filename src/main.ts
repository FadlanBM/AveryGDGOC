import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './swagger';
import path from 'path';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  setupSwagger(app);
  app.setViewEngine('ejs');
  app.setBaseViewsDir(path.join(__dirname, '..', 'src/views'));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
