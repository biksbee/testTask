import { BadRequestException, Injectable } from '@nestjs/common';
import { ParsedToken } from '../auth/interfaces/auth.interface';
import { CreateSubscription } from './subsccription.type';
import { InjectModel } from '@nestjs/sequelize';
import { SubscriptionModel } from './models/subscription.model';
import { UsersSubscriptionsModel } from './models/users-subscriptions.model';
import { UsersModel } from '../auth/models/user.model';
import { ConfigService } from '@nestjs/config';
import * as Moment from 'moment';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(SubscriptionModel)
    private subscriptionModel: typeof SubscriptionModel,
    @InjectModel(UsersSubscriptionsModel)
    private usersSubscriptionModel: typeof UsersSubscriptionsModel,
    @InjectModel(UsersModel)
    private usersModel: typeof UsersModel,
    private readonly configService: ConfigService,
  ) {
  }

  async createTariff() {
    const tariff = await this.subscriptionModel.findAll()
    if (!tariff.length) {
      await this.subscriptionModel.bulkCreate([
        {
          name: 'Basic'
        },
        {
          name: 'Premium'
        }
      ] as SubscriptionModel[])
    }
  }

  async subscribe(data: CreateSubscription, parsedToken: ParsedToken): Promise<void> {
    const subscription = await this.usersSubscriptionModel.findOne({
      where: {
        userId: parsedToken.id
      }
    })
    if (subscription) {
      throw new BadRequestException('Подписка уже оформлена');
    }
    const tariff = await this.subscriptionModel.findByPk(data.tariff)
    if (!tariff) {
         throw new BadRequestException('Неверный id тарифа')
    }
    const lifetime = this.configService.get<string>('SUBSCRIBE_EXPIRES')
    const expires = Moment().add(lifetime, 'ms').toDate()
    //TODO экваринг
    await this.usersSubscriptionModel.create({
      userId: parsedToken.id,
      subscriptionId: tariff.id,
      endsAt: expires,
    } as UsersSubscriptionsModel)
  }

  async unsubscribe(parsedToken: ParsedToken): Promise<void> {
    const subscription = await this.usersSubscriptionModel.findOne({
      where: {
        userId: parsedToken.id
      }
    })
    if (!subscription) {
      throw new BadRequestException('Подписка не найдена');
    }
    await subscription.destroy()
  }

  async subscription(parsedToken: ParsedToken): Promise<void> {}
}
