import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { Intents } from 'discord.js';
import { HttpModule, HttpService } from '@nestjs/axios';

// Gateways
import { SuccessGateway } from './gateways/success.gateway';

// Commands
import { UpdateCommand } from './commands/update.command';

// Controllers
import { WebhookController } from './controllers/webhook.controller';

// Services
import { WebhookService } from './services/webhook.service';
import { SuccessService } from './services/success.service';
import { UserService } from 'src/user/user.service';

// Entities
import { Webhook } from './entities/webhook.entity';

// Modules
import { UserModule } from 'src/user/user.module';

// Twitter
import Twit = require('twit')
import { CoreModule } from 'src/core/core.module';
import { RoleSelectionGateway } from './gateways/role-selection.gateway';
import { RoleSelectionService } from './services/role-selection.service';

@Module({
    imports: [
        DiscModule.forRootAsync({
            useFactory: () => ({
                token: process.env.DISC_BOT_TOKEN,
                discordClientOptions: {
                    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
                    partials: ['REACTION']
                },
            }),
        }),
        TypeOrmModule.forFeature([Webhook]),
        HttpModule,
        UserModule,
        CoreModule
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
    UpdateCommand, SuccessGateway, WebhookService, RoleSelectionGateway, RoleSelectionService],
    exports: [WebhookService],
    controllers: [WebhookController]
})
export class DiscordModule {}
