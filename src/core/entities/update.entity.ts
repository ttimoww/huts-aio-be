import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Update{
    @PrimaryGeneratedColumn()
        updateId: number;
    
    @CreateDateColumn({ type: 'timestamp' })
        timestamp: Date;
    
    @Column()
        version: string;

    @Column()
        url: string;
}