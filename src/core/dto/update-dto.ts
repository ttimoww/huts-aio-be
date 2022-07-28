import { ApiProperty } from '@nestjs/swagger';
import { Update } from '../entities/update.entity';

export class UpdateDto  {
    @ApiProperty()
        id: number;
    
    @ApiProperty()
        url: string;
    
    @ApiProperty()
        version: string;

    @ApiProperty()
        date: Date;

    constructor(update: Update){
        this.id = update.updateId;
        this.url = update.url;
        this.version = update.version;
        this.date = update.timestamp;
    }
}
