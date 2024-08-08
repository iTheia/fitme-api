import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GeneralExceptionFilter } from './filters/exceptions/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralExceptionFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('fitme api')
    .setDescription('Endpoints of fitme api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: configService.get('redis'),
  });

  await app.startAllMicroservices();

  await app.listen(appConfig.port, () => {
    logger.log(`Service started on port ${appConfig.port}`);
  });

  logger.log(`Swagger ${appConfig.host}:${appConfig.port}/api`);
}
bootstrap();
