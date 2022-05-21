import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class License{
    @PrimaryColumn()
        licenseId: string;
    
    @Column()
        plan: string;

    @Column()
        key: string;
        
    @Column()
        lastValidation: Date;

    @Column({ nullable: true })
        ip: string;
    
    @ManyToOne(() => User, user => user.licenses)
        user: User;

    constructor(id: string, plan: string, key: string, lastVal: Date, ip: string, user: User, ){
        this.licenseId = id;
        this.plan = plan;
        this.key = key;
        this.lastValidation = lastVal;
        this.user = user;
        this.ip = ip;
    }
}