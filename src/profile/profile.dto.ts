import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        profileName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
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
        addressLineTwo: string;

    @ApiProperty()
    @IsString()
        houseNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        city: string;

    @ApiProperty()
    @IsString()
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
