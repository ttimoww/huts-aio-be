import { Checkout } from '../checkout/checkout.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { License } from '../auth/license.entity';
import { Webhook } from './entities/webhook.entity';
import { Profile } from 'src/profile/profile.entity';
import { Log } from 'src/log/entities/log.entity';

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

    @Column({ default: false })
        isTester: boolean;

    @OneToMany(() => License, license => license.user)
        licenses: License[];

    @OneToMany(() => Checkout, checkout => checkout.user)
        checkouts: Checkout[];

    @OneToMany(() => Profile, profile => profile.user)
        profiles: Profile[];
    
    @OneToMany(() => Log, log => log.user)
        logs: Log[];
    
    @OneToOne(() => Webhook, webhook => webhook.user)
        webhook: Webhook;

    constructor(email: string, discordId: string, discordTag: string, discordImage: string) {
        this.email = email;
        this.discordId = discordId;
        this.discordTag = discordTag;
        this.discordImage = discordImage;
    }
}