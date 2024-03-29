import { DiscordGuard } from '@discord-nestjs/core';
import { mixin, Type } from '@nestjs/common';
import { Message, MessageReaction } from 'discord.js';

export const ChannelGuard = (allowedChannelId: string): Type<DiscordGuard> => {
    class ChannelGuardMixin implements DiscordGuard {
        canActive(event: 'messageCreate' | 'messageReactionAdd', [message]: [Message | MessageReaction]): boolean {
            let channelId;
    
            if (message instanceof Message) channelId = message.channelId;
            else if (message instanceof MessageReaction) channelId = message.message.channelId;
            else return false;
    
            const isSuccessChannel = channelId === allowedChannelId;
            return isSuccessChannel;
        }
    }

    const guard = mixin(ChannelGuardMixin);
    return guard;
};
