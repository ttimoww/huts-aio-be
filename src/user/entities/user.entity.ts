import { Checkout } from './../../checkout/checkout.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { License } from '../../auth/license.entity';
import { Webhook } from 'src/discord/entities/webhook.entity';
import { Profile } from 'src/profile/profile.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
        userId: number;

    @Column()
        discordId: string;

    @Column({ nullable: true })
        email: string;

    @Column({ unique: true })
        discordTag: string;
    
    @Column()
        discordImage: string;
    
    @Column({ default: 0 })
        successPoints: number;

    @OneToMany(() => License, license => license.user)
        licenses: License[];

    @OneToMany(() => Checkout, checkout => checkout.user)
        checkouts: Checkout[];

    @OneToMany(() => Profile, profile => profile.user)
        profiles: Profile[];
    
    @OneToOne(() => Webhook, webhook => webhook.user)
        webhook: Webhook;

    constructor(email: string, discordId: string, discordTag: string, discordImage: string) {
        this.email = email;
        this.discordId = discordId;
        this.discordTag = discordTag;
        this.discordImage = discordImage;
    }
}