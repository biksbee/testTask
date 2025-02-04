import { BelongsTo, Column, DataType, ForeignKey, Model, Sequelize, Table } from 'sequelize-typescript';
import { UsersModel } from './user.model';

@Table({
  tableName: 'users_tokens',
  comment: 'Таблица с токенами пользователей',
})
export class SessionModel extends Model<SessionModel> {
  @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING(1024), allowNull: true})
  fingerprint: string;

  @Column({type: DataType.DATE, allowNull: true})
  expiresAt: Date;

  @ForeignKey(() => UsersModel)
  @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
  userId: number;

  @Column({type: DataType.STRING, allowNull: false})
  token: string;

  @Column({type: DataType.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')})
  createdAt?: Date

  @Column({type: DataType.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')})
  updatedAt?: Date

  @BelongsTo(() => UsersModel)
  user: UsersModel;
}