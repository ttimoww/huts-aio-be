import { Module } from '@nestjs/common';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { Intents } from 'discord.js';

// Gateways
import { BotGateway } from './bot.gateway';

// Commands
import { LeaderboardCommand } from './commands/leaderboard.command';

@Module({
    imports: [
        DiscModule.forRootAsync({
            useFactory: () => ({
                token: process.env.DISC_BOT_TOKEN,
                discordClientOptions: {
                    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
                },
            }),
        }),
    ],
    providers: [LeaderboardCommand, BotGateway]
})
export class DiscordModule {}
