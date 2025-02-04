import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'subscriptions',
  timestamps: false,
  comment: 'Таблица с подписками'
})
export class SubscriptionModel extends Model<SubscriptionModel> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
}