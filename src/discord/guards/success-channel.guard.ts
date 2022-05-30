import { DiscordGuard } from '@discord-nestjs/core';
import { Message } from 'discord.js';

export class SuccessChannelGuard implements DiscordGuard {
    canActive(event: 'messageCreate', [message]: [Message]): boolean {
        const isSuccessChannel = message.channelId === process.env.DISC_SUCCESS_CHANNEL_ID;
        return isSuccessChannel;
    }
}