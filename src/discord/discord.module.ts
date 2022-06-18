import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { Intents } from 'discord.js';
import { HttpModule, HttpService } from '@nestjs/axios';

// Gateways
import { SuccessGateway } from './success.gateway';

// Commands
import { LeaderboardCommand } from './commands/leaderboard.command';

// Controllers
import { WebhookController } from './webhook.controller';

// Services
import { WebhookService } from './webhook.service';
import { SuccessService } from './success.service';

// Entities
import { Webhook } from './entities/webhook.entity';

// Twitter
import Twit = require('twit')

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
        TypeOrmModule.forFeature([Webhook]),
        HttpModule
    ],
    providers: [{
        provide: SuccessService,
        useFactory: (httpService: HttpService) => {
            return new SuccessService(
                new Twit({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token: process.env.TWITTER_ACCESS_TOKEN,
                    access_token_secret: process.env.TWITTER_TOKEN_SECRET
                }),
                httpService
            );
        },
        inject: [HttpService]
    },
    LeaderboardCommand, SuccessGateway, WebhookService],
    exports: [WebhookService],
    controllers: [WebhookController]
})
export class DiscordModule {}
