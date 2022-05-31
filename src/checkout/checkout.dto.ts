import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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

    @IsString()
    @ApiProperty()
        productPrice: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
        productUrl?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
        paymentUrl?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
        orderId?: string;

    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
        account?: string;
}
