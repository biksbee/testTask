import { ApiProperty } from '@nestjs/swagger';


export class CreateSubscription {
  @ApiProperty({description: 'Id тарифа подписки', example: 'basic: 1, premium: 2'})
  tariff: number;
}