import { Module } from '@nestjs/common';
import { EventEmitterService } from './event-emitter.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_CLIENT',
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: config.get('redis'),
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [EventEmitterService],
  providers: [EventEmitterService],
})
export class EventEmitterModule {}
