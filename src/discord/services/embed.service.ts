// NestJS Dependencies
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';

// Services
import { UserService } from 'src/user/user.service';

// Discord
import { Client, EmbedBuilder, TextChannel, WebhookClient } from 'discord.js';

// Dto
import { CheckoutDto } from 'src/checkout/checkout.dto';

// Entities
import { User } from 'src/user/user.entity';
import { Update } from 'src/core/entities/update.entity';
import { Log } from 'src/log/entities/log.entity';
import { ModuleErrorLog } from 'src/log/entities/module-error-log.entity';

// Enums
import { Store } from 'src/lib/enums/store.enum';

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
    [Store.NewBalance]: 'New Balance',
};
@Injectable()
export class EmbedService {
    private logger = new Logger(EmbedService.name);

    constructor(
        @InjectDiscordClient()
        private readonly discordClient: Client,
        private readonly userService: UserService
    ){}

    /**
     * Send the public and private checkout webhooks
     * @param user The User who made the checkout
     * @param checkout The actual checkout
     */
    async sendCheckout(user: User, checkout: CheckoutDto): Promise<void>{
        this.sendPublicSuccessEmbed(user, checkout);
        this.sendPrivateSuccessEmbed(user, checkout);
    }

    /**
     * Send webhook in public success channel
     * @param user The creator of the checkout
     * @param checkout Checkout details
     */
    private async sendPublicSuccessEmbed(user: User, checkout: CheckoutDto): Promise<void>{
        if (!process.env.DISC_PUBLIC_SUCCESS_CHANNEL) {
            this.logger.warn('No public success channel id found');
            return;
        }

        try {
            const channel = this.discordClient.channels.cache.get(process.env.DISC_PUBLIC_SUCCESS_CHANNEL) as TextChannel;
            const embed = new EmbedBuilder()
                .setColor(webhookStyles.color)
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: `||${storeDictionary[checkout.store]}||`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });

            await channel.send({ embeds: [embed] });
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
    private async sendPrivateSuccessEmbed(user: User, checkout: CheckoutDto): Promise<void>{
        try {
            const webhook = await this.userService.findWebhook(user);
            if (!webhook) return;
            
            const webhookClient = new WebhookClient({ url: webhook.url });
            const embed = new EmbedBuilder()
                .setColor(webhookStyles.color)
                .setThumbnail(checkout.productImage)
                .addFields(
                    { name: 'Product', value: checkout.productUrl ? `[${checkout.productName}](${checkout.productUrl})` : checkout.productName, inline: true },
                    { name: 'Size', value: checkout.productSize, inline: true },
                    { name: 'Price', value: checkout.productPrice, inline: true },
                    { name: 'Store', value: `||${storeDictionary[checkout.store]}||`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });

            if (checkout.orderId) embed.addFields([{ name: 'Order ID', value: `||${checkout.orderId}||`, inline: true }]);
            if (checkout.account) embed.addFields([{ name: 'Account', value: `||${checkout.account}||`, inline: true }]);
            if (checkout.paymentUrl) embed.addFields([{ name: 'Payment URL', value: `[Click](${checkout.paymentUrl})`, inline: true }]);

            await webhookClient.send({ embeds: [embed] });
        } catch (err) {
            this.logger.error(`Unable to send private webhook for ${user.discordTag}`, err);
        }
    }

    /**
     * Formats and sends the log in the Discord logs channel
     * @param log The log to send
     */
    public async sendLogEmbed(log: Log): Promise<void>{
        if (!process.env.DISC_ERROR_LOG_CHANNEL) {
            this.logger.warn('No error channel id found');
            return;
        }

        if (log instanceof ModuleErrorLog){
            const moduleErrorLog = log as ModuleErrorLog;
            const channel = this.discordClient.channels.cache.get(process.env.DISC_ERROR_LOG_CHANNEL) as TextChannel;
            const embed = new EmbedBuilder()
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
            if (log.url) embed.addFields({ name: 'URL', value: `[${log.url}](${log.url})` });

            channel.send({ embeds: [embed] });
        }
    }

    /**
     * Creates an update embed 
     * @param update The update info
     * @param notes The additional notes
     * @param image The additional image
     */
    public createUpdateEmbed(update: Update, notes?: string, image?: string): EmbedBuilder{
        let description = '**Changelog**\n```';

        // Add changelog
        let changelog = '';
        update.changelog.forEach(u => changelog = changelog + '- ' + u + '\n');
        description = description + changelog + '```\n';

        // Add notes
        if (notes) description = description + `**Notes**\n${notes}\n\n`;
        
        // Add download
        description = description + '**Download**\nUse the HutsAIO Hub to auto update';

        const embed = new EmbedBuilder()
            .setColor(webhookStyles.color)
            .setTitle(`HutsAIO  ${'`'}V${update.version}${'`'}`)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'HutsAIO - ' + update.version, iconURL: webhookStyles.icon });

        if (image) embed.setImage(image);
        return embed;
    }

    /**
     * Get a blank Embed in HutsAIO theme
     * @returns Blank Embed with HutsAIO theme
     */
    public getEmbedBase(): EmbedBuilder{
        return new EmbedBuilder()
            .setColor(webhookStyles.color)
            .setTitle('HutsAIO')
            .setTimestamp()
            .setFooter({ text: 'HutsAIO', iconURL: webhookStyles.icon });
    }

    /**
     * Send an webhook (embed) to a specific channel
     * @param channelId Channel to send the webhook to
     * @param embed The embed to send
     */
    public sendAnyEmbed(channelId: string, embed: EmbedBuilder){
        const channel = this.discordClient.channels.cache.get(channelId) as TextChannel;
        channel.send({ embeds: [embed] });
    }
}