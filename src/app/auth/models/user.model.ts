import * as bcrypt from 'bcryptjs';
import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  comment: 'Таблица с пользователями',
  paranoid: true
})
export class UsersModel extends Model<UsersModel> {
  @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
  id: number;

  @Column({type: DataType.STRING, allowNull: true})
  email: string;

  @Column({type: DataType.STRING, allowNull: true})
  password: string;

  @BeforeUpdate
  @BeforeCreate
  static hashPassword(instance: UsersModel) {
    if (instance.changed('password')) {
      instance.password = bcrypt.hashSync(instance.password, 10)
    }
  }
}