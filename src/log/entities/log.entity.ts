import { User } from 'src/user/user.entity';
import { PrimaryGeneratedColumn, CreateDateColumn, Entity, TableInheritance, ManyToOne } from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Log{
    @PrimaryGeneratedColumn()
        id: number;
    
    @CreateDateColumn({ type: 'timestamp' })
        timestamp: Date;

    @ManyToOne(() => User, user => user.logs )
        user: User;
    
    constructor(user: User){
        if (user === undefined) return;
        
        this.user = user;
    }
}