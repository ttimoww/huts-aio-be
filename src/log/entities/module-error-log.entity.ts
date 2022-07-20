import { Log } from './log.entity';
import { ChildEntity, Column } from 'typeorm';
import { Store } from 'src/lib/enums/store.enum';
import ModuleErrogLogDto from '../dto/module-error-log.dto';
import { User } from 'src/user/entities/user.entity';

@ChildEntity()
export class ModuleErrorLog extends Log{
    @Column({ type: 'enum', enum: Store })
        store: Store;
    
    @Column()
        error: string;

    @Column()
        extraInfo: string;

    constructor(dto: ModuleErrogLogDto, user: User){
        super(user);

        if (dto === undefined) return;

        this.store = dto.store;
        this.error = dto.error;
        this.extraInfo = dto.extraInfo;
    }
}