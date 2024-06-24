import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config, configSchemaValidation } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema: configSchemaValidation,
    }),
  ],
})
export class AppModule {}
