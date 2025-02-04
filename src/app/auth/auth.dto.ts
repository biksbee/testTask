import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({example: 'admin@test.aa', description: 'Почта'})
  email: string;

  @ApiProperty({example: '111111', description: 'Пароль'})
  password: string;
}