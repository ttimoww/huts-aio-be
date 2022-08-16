import { Payload, SubCommand, DiscordTransformedCommand, UsePipes, UseGuards, TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { TesterCommandDto } from './../../dto/tester-command.dto.ts';
import { StaffOnlyGuard } from '../../guards/staff-only.guard';
import { TesterService } from 'src/discord/services/tester.service';
import { EmbedService } from 'src/discord/services/embed.service';

@UseGuards(StaffOnlyGuard)
@UsePipes(TransformPipe)
@SubCommand({ name: 'remove', description: 'Remove the tester role from an user' })
export class TesterRemoveSubCommand implements DiscordTransformedCommand<TesterCommandDto> {

    constructor(
        private readonly testerService: TesterService,
        private readonly embedService: EmbedService
    ){}

    async handler(@Payload() dto: TesterCommandDto, { interaction }: TransformedCommandExecutionContext): Promise<void> {
        const member = await interaction.guild.members.fetch(dto.user);
        const success = await this.testerService.removeTester(member, interaction.guild);
        const embed = this.embedService.getEmbedBase();

        if (success) {
            embed.setTitle('✅  Success');
            embed.setDescription(`Successfully **removed** tester role from <@${dto.user}>`);
            interaction.reply({ embeds: [embed] });
        }
        else{
            embed.setTitle('❌ Error');
            embed.setDescription(`Unable to **remove** tester role from <@${dto.user}>`);
            interaction.reply({ embeds: [embed] });
        }
    }
}