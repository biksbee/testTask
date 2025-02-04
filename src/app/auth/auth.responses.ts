import { ApiProperty } from '@nestjs/swagger';

export class UsersResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({type: UsersResponse})
  user: UsersResponse;
}
