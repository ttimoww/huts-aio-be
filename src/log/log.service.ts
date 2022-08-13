import { InjectRepository,  } from '@nestjs/typeorm';
import { Injectable, Logger,  } from '@nestjs/common';
import { Repository } from 'typeorm';

// Dto
import { SuccessDto } from 'src/lib/dto/success.dto';
import ModuleErrogLogDto from './dto/module-error-log.dto';

// Entities
import { ModuleErrorLog } from './entities/module-error-log.entity';
import { User } from 'src/user/user.entity';
import { EmbedService } from 'src/discord/services/embed.service';

@Injectable()
export class LogService {
    private logger = new Logger('LogService');
    constructor(
        @InjectRepository(ModuleErrorLog)
        private readonly moduleErrorlogRepository: Repository<ModuleErrorLog>,
        private readonly webhookService: EmbedService
    ){}

    public async saveModuleErrorLog(user: User, dto: ModuleErrogLogDto): Promise<SuccessDto>{
        try {
            const log = await this.moduleErrorlogRepository.save(new ModuleErrorLog(dto, user));
            this.webhookService.sendLogEmbed(log);
            return { success: !!log };
        } catch (error) {
            this.logger.error('Unable to save new ModuleErrorLog', error);
            return { success: false };
        }
    }
}
