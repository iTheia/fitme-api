import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GeneralExceptionFilter } from './filters/exceptions/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');

  app.useGlobalPipes(new ValidationPipe({}));

  app.useGlobalFilters(new GeneralExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('fitme api')
    .setDescription('Endpoints of fitme api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port, () => {
    logger.log(`Service started on port ${appConfig.port}`);
  });

  logger.log(`Swagger ${appConfig.host}:${appConfig.port}/api`);
}
bootstrap();
