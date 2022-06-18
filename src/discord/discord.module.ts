import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { Intents, User } from 'discord.js';
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
import { UserService } from 'src/user/user.service';

// Entities
import { Webhook } from './entities/webhook.entity';

// Modules
import { UserModule } from 'src/user/user.module';

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
        HttpModule,
        UserModule
    ],
    providers: [{
        provide: SuccessService,
        useFactory: (httpService: HttpService, userService: UserService) => {
            return new SuccessService(
                new Twit({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token: process.env.TWITTER_ACCESS_TOKEN,
                    access_token_secret: process.env.TWITTER_TOKEN_SECRET
                }),
                httpService,
                userService
            );
        },
        inject: [HttpService, UserService]
    },
    LeaderboardCommand, SuccessGateway, WebhookService],
    exports: [WebhookService],
    controllers: [WebhookController]
})
export class DiscordModule {}
