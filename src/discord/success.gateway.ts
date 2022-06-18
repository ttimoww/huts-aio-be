import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient, UseGuards } from '@discord-nestjs/core';
import { Client, ClientUser, Message, MessageReaction } from 'discord.js';
import { SuccessChannelGuard } from './guards/success-channel.guard';
import { SuccessService } from './success.service';

@Injectable()
export class SuccessGateway {
    private readonly logger = new Logger(SuccessGateway.name);

    constructor(
        @InjectDiscordClient()
        private readonly discordClient: Client,
        private readonly successService: SuccessService
    ) {}

    @Once('ready')
    onReady() {
        this.logger.log(`Bot ${this.discordClient.user.tag} was started!`);
    }

    @UseGuards(SuccessChannelGuard)
    @On('messageCreate')
    async onMessage(msg: Message): Promise<void> {
        if (!msg.author.bot) {
            this.successService.handleSuccessPost(msg);
        }
    }

    @UseGuards(SuccessChannelGuard)
    @On('messageReactionAdd')
    async onReact(msg: MessageReaction, user: ClientUser): Promise<void> {
        if (!user.bot){
            this.successService.removeTweet(msg, user);
        }
    }
}
