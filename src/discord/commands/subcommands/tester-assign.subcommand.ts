import { Payload, SubCommand, DiscordTransformedCommand, UsePipes, UseGuards, TransformedCommandExecutionContext } from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import { TesterCommandDto } from '../../dto/tester-command.dto.ts';
import { StaffOnlyGuard } from '../../guards/staff-only.guard';
import { TesterService } from 'src/discord/services/tester.service';
import { EmbedService } from 'src/discord/services/embed.service';

@UseGuards(StaffOnlyGuard)
@UsePipes(TransformPipe)
@SubCommand({ name: 'assign', description: 'Assign the tester role to an user' })
export class TesterAssignSubCommand implements DiscordTransformedCommand<TesterCommandDto> {

    constructor(
        private readonly testerService: TesterService,
        private readonly embedService: EmbedService
    ){}

    async handler(@Payload() dto: TesterCommandDto, { interaction }: TransformedCommandExecutionContext): Promise<void> {
        const member = await interaction.guild.members.fetch(dto.user);
        const success = await this.testerService.assignTester(member, interaction.guild);
        const embed = this.embedService.getEmbedBase();

        if (success) {
            embed.title = '✅  Success';
            embed.description = `Successfully **assigned** tester role to <@${dto.user}>`;
            interaction.reply({ embeds: [embed] });
        }
        else{
            embed.title = '❌ Error';
            embed.description = `Unable to **assign** tester role to <@${dto.user}>`;
            interaction.reply({ embeds: [embed] });
        }
    }
}