import { DiscordGuard } from '@discord-nestjs/core';
import { Message, MessageReaction } from 'discord.js';

export class SuccessChannelGuard implements DiscordGuard {
    canActive(event: 'messageCreate' | 'messageReactionAdd', [message]: [Message | MessageReaction]): boolean {
        let channelId;

        if (message instanceof Message) channelId = message.channelId;
        else if (message instanceof MessageReaction) channelId = message.message.channelId;
        else return false;

        const isSuccessChannel = channelId === process.env.DISC_SUCCESS_POST_CHANNEL;
        return isSuccessChannel;
    }
}