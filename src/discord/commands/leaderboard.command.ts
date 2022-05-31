import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { UseGuards } from '@discord-nestjs/core';
import { StaffOnlyGuard } from '../guards/staff-only.guard';

@Command({
    name: 'leaderboard',
    description: 'Returns the success-post leaderboard'
})
@UseGuards(StaffOnlyGuard)
@Injectable()
export class LeaderboardCommand implements DiscordCommand {
    handler(interaction: CommandInteraction): string {
        return 'BOARD';
    }
}