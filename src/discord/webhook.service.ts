// NestJS Dependencies
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, FindOneOptions } from 'typeorm';
import { WebhookDto } from './dto/webhook.dto';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class WebhookService {
    private logger = new Logger('WebhookService');

    constructor(
        @InjectRepository(Webhook)
        private readonly webhookRepository: Repository<Webhook>,
    ){}

    async findOne(filter: FindOneOptions<Webhook>): Promise<Webhook> {
        return this.webhookRepository.findOne(filter);
    }

    async save(user: User, webhookDto: WebhookDto): Promise<Webhook> {
        const webhook = await this.webhookRepository.findOne({ where: { user: user } });

        if (webhook) {
            webhook.url = webhookDto.url;
            return this.webhookRepository.save(webhook);
        }

        return await this.webhookRepository.save({ url: webhookDto.url, user: user });
    }

    async delete(user: User): Promise<boolean>{
        const res = await this.webhookRepository.delete({ user: user });
        return !!res.affected;
    }
}