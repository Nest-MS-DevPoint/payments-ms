import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { vars } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  
  await app.listen(vars.port ?? 3000);

  logger.log(`Payments Microservices running on port ${vars.port}`);

}
bootstrap();
