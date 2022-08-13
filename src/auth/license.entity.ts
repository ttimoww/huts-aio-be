import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class License{
    @PrimaryColumn()
        licenseId: string;
    
    @Column()
        planId: string;
    
    @Column({ nullable: true })
        plan: string;

    @Column()
        key: string;
        
    @Column()
        lastValidation: Date;

    @Column({ nullable: true })
        ip: string;
    
    @ManyToOne(() => User, user => user.licenses)
        user: User;

    constructor(id: string, planId: string, plan: string, key: string, lastVal: Date, ip: string, user: User, ){
        this.licenseId = id;
        this.planId = planId;
        this.plan = plan;
        this.key = key;
        this.lastValidation = lastVal;
        this.user = user;
        this.ip = ip;
    }
}