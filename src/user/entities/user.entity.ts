import { Checkout } from './../../checkout/checkout.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { License } from '../../auth/license.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
        userId: number;

    @Column()
        discordId: string;

    @Column({ unique: true })
        discordTag: string;
    
    @Column()
        discordImage: string;

    @OneToMany(() => License, license => license.user)
        licenses: License[];

    @OneToMany(() => Checkout, checkout => checkout.user)
        checkouts: Checkout[];

    constructor(discordId: string, discordTag: string, discordImage: string) {
        this.discordId = discordId;
        this.discordTag = discordTag;
        this.discordImage = discordImage;
    }
}