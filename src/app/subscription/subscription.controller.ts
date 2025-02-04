import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { IsSecured } from '../auth/decorators/auth.is-secured.decorator';
import { AuthRequest } from '../auth/interfaces/auth.interface';
import { CreateSubscription } from './subscription.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('subscription/api')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {
  }

  @Post('subscribe')
  @IsSecured()
  @ApiOperation({
    summary: 'Оформление подписки',
    description: 'Этот эндпоинт позволяет оформить подсписку'
  })
  subscribe(
    @Body() dto: CreateSubscription,
    @Req() request: AuthRequest,
  ): Promise<void> {
    return this.subscriptionService.subscribe(dto, request.parsedToken);
  }

  @Post('unsubscribe')
  @IsSecured()
  @ApiOperation({
    summary: 'Удаление подписки',
    description: 'Этот эндпоинт позволяет удалить подсписку'
  })
  unsubscribe(
    @Req() request: AuthRequest,
  ): Promise<void> {
    return this.subscriptionService.unsubscribe(request.parsedToken);
  }

  @Get('subscription')
  @ApiOperation({
    summary: 'Информация о тарифе',
    description: 'Этот эндпоинт позволяет получить информацию о тарифе'
  })
  @IsSecured()
  subscription(
    @Req() request: AuthRequest,
  ): Promise<void> {
    return this.subscriptionService.subscription(request.parsedToken);
  }
}
