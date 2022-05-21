import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserTokenDto extends UserDto {
  @ApiProperty()
      access_token: string;
}
