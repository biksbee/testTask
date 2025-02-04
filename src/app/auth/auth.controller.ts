import { Body, Controller, Post, Req } from '@nestjs/common';
import {Request} from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from './auth.responses';
import { LoginAuthDto } from './auth.dto';
import { IsSecured } from './decorators/auth.is-secured.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('api/register')
  @IsSecured(false)
  @ApiOperation({
    summary: 'Регистрация пользователя',
    description: 'Этот эндпоинт позволяет зарегестрироваться пользователю'
  })
  @ApiResponse({
    status: 201,
    description: 'Авторизационные данные',
    type: AuthResponse
  })
  register(
    @Body() dto: LoginAuthDto,
    @Req() request: Request
  ): Promise<AuthResponse> {
    const fingerprint = request.fingerprint?.hash || '';
    return this.authService.register({ ...dto, fingerprint })
  }

  @Post('api/login')
  @IsSecured(false)
  @ApiOperation({
    summary: 'Авторизация пользователя',
    description: 'Этот эндпоинт позволяет авторизироваться пользователю'
  })
  @ApiResponse({
    status: 200,
    description: 'Авторизационные данные',
    type: AuthResponse
  })
  login(
    @Body() dto: LoginAuthDto,
    @Req() request: Request
  ): Promise<AuthResponse> {
    const fingerprint = request.fingerprint?.hash || '';
    return this.authService.login({ ...dto, fingerprint })
  }
}
