import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
      discordId: string;

    @ApiProperty()
    @IsNotEmpty()
        discordTag: string;

    @ApiProperty()
    @IsNotEmpty()
        discordImage: string;

}
