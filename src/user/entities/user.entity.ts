import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Checkout } from 'src/checkout/checkout.entity';
import { License } from './license.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
        userId: number;

    @Column()
        discordId: string;

    @Column()
        discordTag: string;
    
    @Column()
        discordImage: string;
    
    @Column({ nullable: true })
        ip: string;

    @OneToMany(() => License, license => license.user)
        licenses: License[];

    @OneToMany(() => Checkout, checkout => checkout.user)
        checkouts: Checkout[];

    constructor(discordId: string, discordTag: string, discordImage: string) {
        this.discordId = discordId;
        this.discordTag = discordTag;
        this.discordImage = discordImage;
        this.ip = 'REMOVE?';
    }
}