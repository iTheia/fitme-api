import { Module } from '@nestjs/common';
import { HealthCheckModule } from './Modules/health-check/health-check.module';
import { ConfigModule } from '@nestjs/config';
import { config, configSchemaValidation } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema: configSchemaValidation,
    }),
    HealthCheckModule,
  ],
})
export class AppModule {}
