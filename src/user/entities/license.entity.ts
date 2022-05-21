import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

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
    
    @ManyToOne(() => User, user => user.licenses)
        user: User;

    constructor(id: string, plan: string, key: string, lastVal: Date, user: User){
        this.licenseId = id;
        this.plan = plan;
        this.key = key;
        this.lastValidation = lastVal;
        this.user = user;
    }
}