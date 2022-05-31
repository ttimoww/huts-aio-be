import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { Intents } from 'discord.js';

// Gateways
import { BotGateway } from './bot.gateway';

// Commands
import { LeaderboardCommand } from './commands/leaderboard.command';

// Controllers
import { WebhookController } from './webhook.controller';

// Services
import { WebhookService } from './webhook.service';

// Entities
import { Webhook } from './entities/webhook.entity';

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
        TypeOrmModule.forFeature([Webhook])
    ],
    providers: [LeaderboardCommand, BotGateway, WebhookService],
    exports: [WebhookService],
    controllers: [WebhookController]
})
export class DiscordModule {}
