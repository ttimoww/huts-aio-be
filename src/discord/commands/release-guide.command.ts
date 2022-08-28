// NestJS
import { Injectable, Logger } from '@nestjs/common';

// Discrod
import { Command, UsePipes, Payload, DiscordTransformedCommand, UseGuards, TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Guards
import { StaffOnlyGuard } from '../guards/staff-only.guard';

// Dto
import { ReleaseGuideCommandDto } from '../dto/release-guide-command.dto';

// Services
import { EmbedService } from '../services/embed.service';
import { Store } from 'src/lib/enums/store.enum';

// Others
import { storeNameDictionary } from 'src/lib/dictionaries/store-name.dictionary';

@Command({
    name: 'release-guide',
    description: 'Create and publish a new release guide',
})
@UseGuards(StaffOnlyGuard)
@Injectable()
@UsePipes(TransformPipe)
export class ReleaseGuideCommand implements DiscordTransformedCommand<ReleaseGuideCommandDto>{
    private logger = new Logger('ReleaseGuideCommand');

    constructor(
        private readonly webhookService: EmbedService,
    ){}

    async handler(@Payload() dto: ReleaseGuideCommandDto, { interaction }: TransformedCommandExecutionContext): Promise<void> {        
        const RELEASE_BUTTON = 'release' + interaction.id;
        const CANCEL_BUTTON = 'cancel' + interaction.id;

        // Check for valid image URL
        const imgUrlRegex = new RegExp(/^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg|PNG|GIF|WEBP|JPEG|JPG)\??.*$/, '');
        if (!dto.image.match(imgUrlRegex)){
            interaction.reply('Invalid image URL');
            return;
        }

        const embed = this.webhookService.getEmbedBase(true);

        try {
            embed.setTitle(`New ${storeNameDictionary[dto.store]} Drop`);
            embed.setImage(dto.image);

            // Name + Time
            let description = `**Item**\n${dto.name}\n\n**Time**\n${dto.time}\n\n`;

            // Early Info
            if (dto.earlyinfo) description = description + `**Early Info**\n${dto.earlyinfo}\n\n`;

            // Snipes + SBX Guide
            if (dto.store === Store.Snipes || dto.store === Store.Solebox) description = description + '**Guide**\nAfter we ping PX-up, make sure to log in and wait on the account page.\n\n';

            if (dto.notes) description = description + `**Notes**\n${dto.notes}\n\n`;

            embed.setDescription(description);

            /**
             * Create buttons
             */
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
                new ButtonBuilder()
                    .setCustomId(RELEASE_BUTTON)
                    .setLabel('Release')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(CANCEL_BUTTON)
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
            ]);

            await interaction.reply({ content: `Guide will be send in <#${dto.channel}>`, embeds: [embed], components: [row] });

        } catch (error) {
            this.logger.error('Unable to create new release guide', error);
            return;
        }
        /**
         * Handle buttons
         */
        const filter = i => (i.customId ===  RELEASE_BUTTON || i.customId === CANCEL_BUTTON) && i.user.id === interaction.member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 900000, max: 1 });
        collector.on('collect', async i => {
            try {
                /**
                  * Release the guide
                  */
                if (i.customId === RELEASE_BUTTON){
                    await this.webhookService.sendAnyEmbed(dto.channel, embed);
                    embed.setColor('#2ecc71');
                    await i.update({ components: [], embeds: [embed] });
                    await i.followUp('Successfully published release guide');
                    return collector.stop();
                }
                 
                /**
                  * Do nothing on cancel
                  */
                embed.setColor('#e74c3c');
                await i.update({ components: [], embeds: [embed] });
                return collector.stop();
            } catch (error) {
                this.logger.error('Unable to publish new release guide', error);
                i.editReply(error);
            }
        });
    }
}