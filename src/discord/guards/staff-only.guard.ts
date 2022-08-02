import { DiscordGuard } from '@discord-nestjs/core';
import { Message } from 'discord.js';

export class StaffOnlyGuard implements DiscordGuard {
    canActive(event: 'messageCreate', [message]: [Message]): boolean {
        const allowedRoles = ['staff', 'owner'];
        const isStaff = (message.member.roles.cache.some(role => allowedRoles.includes(role.name.toLowerCase())));
        return isStaff;
    }
}