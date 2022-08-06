import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Store } from 'src/lib/enums/store.enum';

export default class ModuleErrogLogDto{
    @IsEnum(Store)
    @ApiProperty({ name: 'store', enum: Store })
        store: Store;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
        url?: string;

    @ApiProperty()
    @IsString()
        error: string;
    
    @IsString()
    @ApiProperty()
        extraInfo: string;
}