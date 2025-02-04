import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionModel } from './models/subscription.model';
import { UsersSubscriptionsModel } from './models/users-subscriptions.model';
import { UsersModel } from '../auth/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SubscriptionModel,
      UsersSubscriptionsModel,
      UsersModel
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {
  constructor(
    private readonly subscriptionService: SubscriptionService
  ) {
    this.subscriptionService.createTariff()
  }
}
