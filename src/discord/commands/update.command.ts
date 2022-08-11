// NestJS
import { Injectable, Logger } from '@nestjs/common';

// Discrod
import { Command, UsePipes, Payload, DiscordTransformedCommand, UseGuards, TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { MessageActionRow, MessageButton } from 'discord.js';

// Guards
import { StaffOnlyGuard } from '../guards/staff-only.guard';

// Dto
import { UpdateCommandDto } from '../dto/update.command.dto';

// Services
import { UpdateService } from 'src/core/update.service';
import { WebhookService } from '../services/webhook.service';

// Entities
import { Update } from 'src/core/entities/update.entity';

@Command({
    name: 'update',
    description: 'Create and publish a new update',
})
@UseGuards(StaffOnlyGuard)
@Injectable()
@UsePipes(TransformPipe)
export class UpdateCommand implements DiscordTransformedCommand<UpdateCommandDto>{
    private logger = new Logger('UpdateCommand');

    constructor(
        private readonly webhookService: WebhookService,
        private readonly updateService: UpdateService
    ){}

    async handler(@Payload() dto: UpdateCommandDto, { interaction }: TransformedCommandExecutionContext): Promise<void> {        
        const RELEASE_BUTTON = 'release' + interaction.id;
        const CANCEL_BUTTON = 'cancel' + interaction.id;

        const update = new Update(dto);
        const embed = this.webhookService.createUpdateWebhook(update, dto.notes, dto.image);

        const row = new MessageActionRow().addComponents([
            new MessageButton()
                .setCustomId(RELEASE_BUTTON)
                .setLabel('Release')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId(CANCEL_BUTTON)
                .setLabel('Cancel')
                .setStyle('DANGER'),
        ]);

        await interaction.reply({ embeds: [embed], components: [row] });

        /**
         * Handle buttons
         */
        const filter = i => (i.customId ===  RELEASE_BUTTON || i.customId === CANCEL_BUTTON) && i.user.id === interaction.member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 900000, max: 1 });
        collector.on('collect', async i => {
            try {
                /**
                 * Get updates channel
                 */
                if (!process.env.DISC_UPDATES_CHANNEL) {
                    this.logger.warn('No updates channel ID found');
                    await i.reply('No updates channel ID found');
                    return collector.stop();
                }

                /**
                 * Save update and save webhook
                 */
                if (i.customId === RELEASE_BUTTON){
                    this.logger.verbose(`Saving new update (V${dto.version})`);
                    await this.updateService.save(update);
                    await this.webhookService.sendAnyWebhook(process.env.DISC_UPDATES_CHANNEL, embed);
                    embed.setColor('#2ecc71');
                    await i.update({ components: [], embeds: [embed] });
                    await i.followUp(`Successfully released V${dto.version}`);
                    return collector.stop();
                }
                
                /**
                 * Dot nothing on cancel
                 */
                embed.setColor('#e74c3c');
                await i.update({ components: [], embeds: [embed] });
                return collector.stop();
            } catch (error) {
                this.logger.error('Unable to create new update', error);
                i.editReply(error);
            }
        });
    }
}