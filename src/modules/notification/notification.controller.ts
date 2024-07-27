import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';
import { AccountCreatedEvent } from '@common/events';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('account.created')
  handleEvent(data: AccountCreatedEvent) {
    console.log('Received event:', data);
  }
}
