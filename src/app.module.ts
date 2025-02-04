import { Module } from '@nestjs/common';
import { AuthModule } from './app/auth/auth.module';
import { SubscriptionModule } from './app/subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      autoLoadModels: true,
      sync: {
        alter: true,
        // force: true,
      },
      logging: (data) => {

      }
    }),
    SubscriptionModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
