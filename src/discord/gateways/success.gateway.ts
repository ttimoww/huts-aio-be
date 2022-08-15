import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient, UseGuards } from '@discord-nestjs/core';
import { Client, ClientUser, Message, MessageReaction } from 'discord.js';
import { ChannelGuard } from '../guards/channel.guard';
import { SuccessService } from '../services/success-channel.service';

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

    // @UseGuards(ChannelGuard(process.env.DISC_SUCCESS_POST_CHANNEL))
    @On('messageCreate')
    async onMessage(msg: Message): Promise<void> {
        console.log(msg);
        if (!msg.author.bot) {
            this.successService.handleSuccessPost(msg);
        }
    }

    @UseGuards(ChannelGuard(process.env.DISC_SUCCESS_POST_CHANNEL))
    @On('messageReactionAdd')
    async onReact(msg: MessageReaction, user: ClientUser): Promise<void> {
        console.log(msg);
        if (!user.bot){
            this.successService.removeTweet(msg, user);
        }
    }
}
