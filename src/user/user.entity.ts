import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
        userId: number;
    
    @Column()
        key: string;

    @Column()
        discordId: string;

    @Column({ unique: true })
        licenseId: string;

    @Column()
        discordTag: string;
    
    @Column()
        discordImage: string;

    @Column()
        lastAuth: Date;
    
    @Column({ nullable: true })
        ip: string;

    constructor(key: string, discordId: string, discordTag: string, discordImage: string, lastAuth: Date, ip: string, licenseId: string) {
        this.key = key;
        this.discordId = discordId;
        this.discordTag = discordTag;
        this.discordImage = discordImage;
        this.lastAuth = lastAuth;
        this.ip = ip;
        this.licenseId = licenseId;
    }
}