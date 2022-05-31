import { DiscordGuard } from '@discord-nestjs/core';
import { Message } from 'discord.js';

export class StaffOnlyGuard implements DiscordGuard {
    canActive(event: 'messageCreate', [message]: [Message]): boolean {
        const isStaff = (message.member.roles.cache.some(role => role.name === 'staff'));
        return isStaff;
    }
}