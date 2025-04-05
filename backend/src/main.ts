/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Virtual Interview API')
    .setDescription('The Virtual Interview API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
void bootstrap();
