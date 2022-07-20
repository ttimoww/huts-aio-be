import { InjectRepository,  } from '@nestjs/typeorm';
import { Injectable, Logger,  } from '@nestjs/common';
import { Repository } from 'typeorm';

// Dto
import { SuccessDto } from 'src/lib/dto/success.dto';
import ModuleErrogLogDto from './dto/module-error-log.dto';

// Entities
import { ModuleErrorLog } from './entities/module-error-log.entity';
import { User } from 'src/user/entities/user.entity';
import { WebhookService } from 'src/discord/webhook.service';

@Injectable()
export class LogService {
    private logger = new Logger('LogService');
    constructor(
        @InjectRepository(ModuleErrorLog)
        private readonly moduleErrorlogRepository: Repository<ModuleErrorLog>,
        private readonly webhookService: WebhookService
    ){}

    public async saveModuleErrorLog(user: User, dto: ModuleErrogLogDto): Promise<SuccessDto>{
        try {
            const log = await this.moduleErrorlogRepository.save(new ModuleErrorLog(dto, user));
            this.webhookService.sendLogWebhook(log);
            return { success: !!log };
        } catch (error) {
            this.logger.error('Unable to save new ModuleErrorLog', error);
            return { success: false };
        }
    }
}
