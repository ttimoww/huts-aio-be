// NestJS Dependencies
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

// Discord
import { Client, MessageEmbed, TextChannel, WebhookClient } from 'discord.js';

// Dto
import { CheckoutDto } from 'src/checkout/checkout.dto';
import { WebhookDto } from './dto/webhook.dto';

// Entities
import { User } from 'src/user/entities/user.entity';
import { Webhook } from './entities/webhook.entity';

// Enums
import { Store } from 'src/lib/enums/store.enum';
import { ModuleErrorLog } from 'src/log/entities/module-error-log.entity';
import { Log } from 'src/log/entities/log.entity';

// Config
import * as config from 'config';
const webhookStyles = config.get('webhookStyles');

// Dictionary to format the store name
const storeDictionary = {
    [Store.LVR]: 'Luisaviaroma',
    [Store.Snipes]: 'Snipes',
    [Store.Solebox]: 'Solebox',
    [Store.Zalando]: 'Zalando',
    [Store.Kith]: 'Kith EU',
    [Store.Supreme]: 'Supreme',
};
@Injectable()
export class WebhookService {
    private logger = new Logger('WebhookService');

    constructor(
        @InjectRepository(Webhook)
        private readonly webhookRepository: Repository<Webhook>,
        @InjectDiscordClient()
        private readonly discordClient: Client,
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

    async send(user: User, checkout: CheckoutDto): Promise<void>{
        this.sendPublicSuccessWebhook(user, checkout);
        this.sendPrivateSuccessWebhook(user, checkout);
    }

    /**
     * Send webhook in public success channel
     * @param user The creator of the checkout
     * @param checkout Checkout details
     */
    private async sendPublicSuccessWebhook(user: User, checkout: CheckoutDto): Promise<void>{
        if (!process.env.DISC_PUBLIC_SUCCESS_CHANNEL) {
            this.logger.warn('No public success channel id found');
            return;
        }
        
        try {
            const channel = this.discordClient.channels.cache.get(process.env.DISC_PUBLIC_SUCCESS_CHANNEL) as TextChannel;
            const embed = new MessageEmbed()
                .setColor(webhookStyles.color)
                .setTitle('HutsAIO delivered 🥶')
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: storeDictionary[checkout.store], inline: true },
                    { name: 'User', value: user.discordTag, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });

            channel.send({ embeds: [embed] });
        } catch (err) {
            this.logger.error('Unable to send public webhook', err);
        }
    }

    /**
     * Sends a webhook to the Users private webhook
     * When no webhhok saved, do nothing
     * @param user The creator of the checkout
     * @param checkout Checkout details
     */
    private async sendPrivateSuccessWebhook(user: User, checkout: CheckoutDto): Promise<void>{
        try {
            const webhook = await this.webhookRepository.findOne({ where: { user: user } });
            if (!webhook) return;
            
            const webhookClient = new WebhookClient({ url: webhook.url });
            const embed = new MessageEmbed()
                .setColor(webhookStyles.color)
                .setTitle('HutsAIO delivered 🥶')
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: storeDictionary[checkout.store], inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });

            if (checkout.orderId) embed.addField('Order ID', `||${checkout.orderId}||`, true);
            if (checkout.account) embed.addField('Account', `||${checkout.account}||`, true);
            if (checkout.paymentUrl) embed.addField('Payment URL', `[Click](${checkout.paymentUrl})`);

            webhookClient.send({ embeds: [embed] });
        } catch (err) {
            this.logger.error(`Unable to send private webhook for ${user.discordTag}`, err);
        }
    }

    /**
     * Formats and sends the log in the Discord logs channel
     * @param log The log to send
     */
    public async sendLogWebhook(log: Log): Promise<void>{
        if (!process.env.DISC_ERROR_LOG_CHANNEL) {
            this.logger.warn('No error channel id found');
            return;
        }

        if (log instanceof ModuleErrorLog){
            const moduleErrorLog = log as ModuleErrorLog;
            const channel = this.discordClient.channels.cache.get(process.env.DISC_ERROR_LOG_CHANNEL) as TextChannel;
            const embed = new MessageEmbed()
                .setColor('#e74c3c')
                .setTitle('Module Error')
                .addFields(
                    { name: 'Store', value: storeDictionary[log.store], inline: true },
                    { name: 'User', value: moduleErrorLog.user.discordTag, inline: true },
                    { name: 'Error', value: '```' + moduleErrorLog.error + '```' },
                    { name: 'Info', value: '```' + moduleErrorLog.extraInfo + '```', inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });
            channel.send({ embeds: [embed] });
        }
    }
}