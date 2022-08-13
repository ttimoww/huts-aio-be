// NestJS Dependencies
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { Webhook } from './entities/webhook.entity';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class UserService {
    private logger = new Logger('UserService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Webhook)
        private readonly webhookRepository: Repository<Webhook>,
    ){}

    public async findOne(filter: FindOneOptions<User>): Promise<User> {
        return this.userRepository.findOne(filter);
    }

    public async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    /**
     * Add or Substract successpoints to a user
     * @param discordId The user to add or substract points to
     * @param type Add or Substract
     * @param amount Amount
     * @returns previous points and current points
     */
    public async mutateSuccessPoints(discordId: string, type: 'add' | 'substract', amount: number): Promise<[number, number]>{
        const user = await this.userRepository.findOneOrFail({ where: { discordId: discordId } });
        const previousPoints = user.successPoints;

        if (type === 'add'){
            user.successPoints += amount;
        }else{
            user.successPoints -= amount;
        }

        const savedUser = await this.userRepository.save(user);
        return [previousPoints, savedUser.successPoints];
    }

    /**
     * Find the Webhook for a specific User
     * @param user The user to get the webhook from
     * @returns The Webhook
     */
    public async findWebhook(user: User): Promise<Webhook> {
        return this.webhookRepository.findOne({ where: { user: user } });
    }

    /**
     * Save a new Webhook for a specific User
     * @param user The User to save the Webhook for
     * @param webhookDto The Webhook data 
     * @returns The Webhook
     */
    public async saveWebhook(user: User, webhookDto: WebhookDto): Promise<Webhook> {
        const webhook = await this.webhookRepository.findOne({ where: { user: user } });

        if (webhook) {
            webhook.url = webhookDto.url;
            return this.webhookRepository.save(webhook);
        }

        return await this.webhookRepository.save({ url: webhookDto.url, user: user });
    }

    /**
     * Delete a saved webhook from an User
     * @param user The user to delete the Webhook from
     */
    public async deleteWebhook(user: User): Promise<boolean>{
        const res = await this.webhookRepository.delete({ user: user });
        return !!res.affected;
    }

    /**
     * Toggle the tester flag to an specific User
     * @param discordId The discord ID of the user
     * @param isTester The new flag value
     * @returns Wheter the operation succeeded or not
     */
    public async toggleTesterFlag(discordId: string, isTester: boolean): Promise<boolean>{
        const user = await this.userRepository.findOneOrFail({ where: { discordId: discordId } });
        user.isTester = isTester;
        const res = await this.userRepository.save(user);
        return !!res;
    }
}