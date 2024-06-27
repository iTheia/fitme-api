import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, configSchemaValidation } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema: configSchemaValidation,
    }),
    HealthCheckModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return { uri: configService.get('database').url };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule {}
