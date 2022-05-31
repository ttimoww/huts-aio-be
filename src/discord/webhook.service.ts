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
        this.sendPublicWebhook(user, checkout);
        this.sendPrivateWebhook(user, checkout);
    }

    /**
     * Send webhook in public success channel
     * @param user The creator of the checkout
     * @param checkout Checkout details
     */
    private async sendPublicWebhook(user: User, checkout: CheckoutDto): Promise<void>{
        try {
            const channel = this.discordClient.channels.cache.get(process.env.DISC_SUCCESS_POST_CHANNEL_ID) as TextChannel;
            const embed = new MessageEmbed()
                .setColor('#6366F1')
                .setTitle('HutsAIO delivered 🥶')
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: checkout.store, inline: true },
                    { name: 'User', value: user.discordTag, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });

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
    private async sendPrivateWebhook(user: User, checkout: CheckoutDto): Promise<void>{
        try {
            const webhook = await this.webhookRepository.findOne({ where: { user: user } });
            if (!webhook) return;
            
            const webhookClient = new WebhookClient({ url: webhook.url });
            const embed = new MessageEmbed()
                .setColor('#6366F1')
                .setTitle('HutsAIO delivered 🥶')
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: checkout.store, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });

            if (checkout.orderId) embed.addField('Order ID', checkout.orderId, true);
            if (checkout.account) embed.addField('Account', `||${checkout.orderId}||`, true);
            if (checkout.paymentUrl) embed.addField('Payment URL', `[Click](${checkout.paymentUrl})`);

            webhookClient.send({ embeds: [embed] });
        } catch (err) {
            this.logger.error(`Unable to send private webhook for ${user.discordTag}`, err);
        }
    }
}