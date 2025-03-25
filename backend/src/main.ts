/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const appOptions = { 
    cors: {
      origin: true,
      credentials: true
    }
  };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');
  
  // Add cookie-parser middleware
  app.use(cookieParser());
  
  await app.listen(3000);
}
void bootstrap();
