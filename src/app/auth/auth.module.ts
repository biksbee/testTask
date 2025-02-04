import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FingerprintMiddleware } from './middleware/fingerprint.middleware';
import { UsersModel } from './models/user.model';
import { SessionModel } from './models/session.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UsersModel,
      SessionModel
    ]),
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET || 'secret',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FingerprintMiddleware)
      .forRoutes(AuthController)
  }
}
