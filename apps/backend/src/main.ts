import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { API_PREFIX } from './constants';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix(API_PREFIX);
  
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`SharkPark API running on http://localhost:${port}/${API_PREFIX}`);
}
bootstrap();
