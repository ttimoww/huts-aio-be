import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
      discordId: string;

    @ApiProperty()
        discordTag: string;

    @ApiProperty()
        discordImage: string;
        
    @ApiProperty()
        plan: string;

    @ApiProperty()
        email: string;

    @ApiProperty()
        key: string;
}
