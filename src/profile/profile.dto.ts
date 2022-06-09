import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfileDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsNotEmpty()
        profileName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        email: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        addressLineOne: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    @IsOptional()
        addressLineTwo?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        houseNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        province: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        postalCode: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        phone: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        country: string;
}
