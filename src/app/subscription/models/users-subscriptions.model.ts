import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { UsersModel } from '../../auth/models/user.model';
import { SubscriptionModel } from './subscription.model';

@Table({
  tableName: 'users_subscriptions',
  timestamps: true,
  comment: 'Таблица с подписками пользователей',
  paranoid: true
})
export class UsersSubscriptionsModel extends Model<UsersSubscriptionsModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => UsersModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => SubscriptionModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  subscriptionId: number;

  @Column({ type: DataType.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')})
  startedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endsAt: Date;

  @BelongsTo(() => UsersModel)
  user: UsersModel;

  @BelongsTo(() => SubscriptionModel)
  subscription: SubscriptionModel;
}