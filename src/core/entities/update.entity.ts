import { UpdateCommandDto } from 'src/discord/dto/update.command.dto';
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
    
    @Column('simple-array', { nullable: true })
        changelog: string[];

    constructor(dto: UpdateCommandDto){
        if (dto === undefined) return;
        this.version = dto.version;
        this.url = dto.url;

        const changelog = [];
        if (dto.cl1) changelog.push(dto.cl1);
        if (dto.cl2) changelog.push(dto.cl2);
        if (dto.cl3) changelog.push(dto.cl3);
        if (dto.cl4) changelog.push(dto.cl4);
        if (dto.cl5) changelog.push(dto.cl5);
        if (dto.cl6) changelog.push(dto.cl6);
        if (dto.cl7) changelog.push(dto.cl7);
        if (dto.cl8) changelog.push(dto.cl8);
        this.changelog = changelog;
    }
}