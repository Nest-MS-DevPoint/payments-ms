import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { vars } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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

  logger.log('Connecting to NATS...');
  logger.debug('vars', vars);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: vars.natsServers,
      name: 'PAYMENTS_SERVICE'
    },
  }, {
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();
  
  await app.listen(vars.port ?? 3000);

  logger.log(`Payments Microservices running on port ${vars.port}`);

}
bootstrap();
