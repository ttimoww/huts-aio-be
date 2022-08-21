import { Module } from '@nestjs/common';
import { DiscordModule as DiscModule } from '@discord-nestjs/core';
import { GatewayIntentBits, Partials } from 'discord.js';
import { HttpModule, HttpService } from '@nestjs/axios';

// Gateways
import { SuccessGateway } from './gateways/success.gateway';

// Commands
import { UpdateCommand } from './commands/update.command';
import { TesterCommand } from './commands/tester.command';
import { TesterRemoveSubCommand } from './commands/subcommands/tester-remove.subcommand';
import { TesterAssignSubCommand } from './commands/subcommands/tester-assign.subcommand';

// Services
import { EmbedService } from './services/embed.service';
import { SuccessService } from './services/success-channel.service';
import { UserService } from 'src/user/user.service';
import { TesterService } from './services/tester.service';

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
                    intents: [
                        GatewayIntentBits.Guilds, 
                        GatewayIntentBits.GuildMessages, 
                        GatewayIntentBits.GuildMessageReactions, 
                        GatewayIntentBits.MessageContent
                    ],
                    partials: [
                        Partials.Reaction, 
                        Partials.Message
                    ]
                },
            }),
        }),
        HttpModule,
        UserModule,
        CoreModule
    ],
    providers: [
        {
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
        UpdateCommand, 
        TesterCommand, 
        TesterAssignSubCommand, 
        TesterRemoveSubCommand, 
        SuccessGateway, 
        EmbedService, 
        RoleSelectionGateway, 
        RoleSelectionService,
        TesterService
    ],
    exports: [EmbedService]
})
export class DiscordModule {}