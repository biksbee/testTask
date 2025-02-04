import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from './models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { AuthResponse } from './auth.responses';
import { CreateSession, UsersLoginType } from './auth.typs';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js'
import * as Moment from 'moment';
import { SessionModel } from './models/session.model';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms = require('ms');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersModel)
    private usersModel: typeof UsersModel,
    @InjectModel(SessionModel)
    private sessionModel: typeof SessionModel,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
  }

  async register(data: UsersLoginType): Promise<AuthResponse> {
    const {fingerprint, ...obj} = data
    const candidate = await this.usersModel.findOne({ where: { email: obj.email } });
    if (candidate) {
      throw new UnauthorizedException('Incorrect login data');
    }
    const user = await this.usersModel.create(obj as UsersModel)
    return this.generateAuthResponse(user, fingerprint)
  }

  async login(data: UsersLoginType): Promise<AuthResponse> {
    const user = await this.usersModel.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('Incorrect login data');
    }
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Incorrect login data')
    }
    await this.deleteToken({ fingerprint: data.fingerprint, userId: user.id })
    return this.generateAuthResponse(user, data.fingerprint)
  }

  async deleteToken(data) {
    const fingerprint = CryptoJS
        .SHA512(data.fingerprint)
        .toString(CryptoJS.enc.Base64)
    return await this.sessionModel.destroy({
      where: {
        userId: data.userId,
        fingerprint
      }
    })
  }

  async generateToken(payload, expiresIn: string) {
    const secret = this.configService.get<string>('JWT_TOKEN_SECRET')
    return this.jwtService.sign(
      payload, {
        secret,
        expiresIn
      }
    )
  }

  async generateAuthResponse(user, fingerprint: string): Promise<AuthResponse> {
    const accessTokenLifeTime = this.configService.get<string>('ACCESS_TOKEN_LIFE_TIME') as string
    const refreshTokenLifeTime = this.configService.get<string>('REFRESH_TOKEN_LIFE_TIME') as string
    const refreshToken = await this.generateToken({ id: user.id }, refreshTokenLifeTime)
    await this.createSession({
      token: refreshToken,
      fingerprint,
      userId: user.id
    })

    return {
      accessToken: await this.generateToken({ id: user.id }, accessTokenLifeTime),
      refreshToken,
      user
    }
  }

  async createSession (data: CreateSession): Promise<SessionModel> {
    const refreshTokenLifeTime = this.configService.get<string>('REFRESH_TOKEN_LIFE_TIME') as string
    const secret = this.configService.get<string>('TOKEN_SECRET') as string
    data.token = CryptoJS
      .HmacSHA512(data.token, secret)
      .toString(CryptoJS.enc.Base64)

    const lifetime = ms(refreshTokenLifeTime as ms.StringValue) || null
    const expiresAt = Moment().add(lifetime, 'ms').toDate()
    const fingerprint = CryptoJS
        .SHA512(data.fingerprint)
        .toString(CryptoJS.enc.Base64)
    return this.sessionModel.create({
      token: data.token,
      expiresAt,
      fingerprint,
      userId: data.userId
    } as SessionModel)
  }



}
