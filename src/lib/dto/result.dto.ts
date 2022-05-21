import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
    @ApiProperty()
        result: boolean;
}