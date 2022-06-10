import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './../user/entities/user.entity';
import { ProfileDto } from './profile.dto';

@Entity()
export class Profile{
    @PrimaryGeneratedColumn()
        profileId: number;

    @Column()
        profileName: string;

    @Column()
        email: string;
    
    @Column()
        firstName: string;

    @Column()
        lastName: string;

    @Column()
        addressLineOne: string;

    @Column({ nullable: true })
        addressLineTwo?: string;

    @Column()
        houseNumber: string;

    @Column()
        city: string;

    @Column()
        province: string;

    @Column()
        postalCode: string;
    
    @Column()
        phone: string;
    
    @Column()
        country: string;

    @ManyToOne(() => User, user => user.profiles)
        user: User;

    constructor(dto: ProfileDto, user: User){
        if (dto === undefined || user === undefined) return;
        
        this.profileName = dto.profileName;
        this.email = dto.email;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.addressLineOne = dto.addressLineOne;
        this.addressLineTwo = dto.addressLineTwo;
        this.houseNumber = dto.houseNumber;
        this.city = dto.city;
        this.province = dto.province;
        this.postalCode = dto.postalCode;
        this.phone = dto.phone;
        this.country = dto.country;
        this.user = user;
    }
}
