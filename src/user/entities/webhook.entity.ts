import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Webhook{
    @PrimaryGeneratedColumn()
        webhookId: number;
    
    @Column()
        url: string;

    @OneToOne(() => User, user => user.webhook)
    @JoinColumn()
        user: User;
}