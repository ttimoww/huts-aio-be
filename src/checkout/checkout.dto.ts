import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Store } from 'src/lib/enums/store.enum';

export class CheckoutDto  {
    @IsEnum(Store)
    @ApiProperty({ name: 'store', enum: Store })
        store: Store;
    
    @ApiProperty()
    @IsString()
        productName: string;
    
    @IsString()
    @ApiProperty()
        productSize: string;
    
    @IsString()
    @ApiProperty()
        productImage: string;
}
