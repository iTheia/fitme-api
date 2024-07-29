import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventEmitterService implements OnModuleInit {
  constructor(@Inject('REDIS_CLIENT') private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  emitEvent(pattern: string, data: any) {
    this.client.emit(pattern, data);
  }

  sendEvent(pattern: string, data: any) {
    return this.client.send(pattern, data);
  }
}
