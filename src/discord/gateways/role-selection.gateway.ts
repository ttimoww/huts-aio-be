import { Injectable, Logger } from '@nestjs/common';
import { On, Once, UseGuards } from '@discord-nestjs/core';
import { ClientUser, MessageReaction,  } from 'discord.js';
import { ChannelGuard } from '../guards/channel.guard';
import { RoleSelectionService } from '../services/role-selection.service';

@Injectable()
export class RoleSelectionGateway {
    private readonly logger = new Logger(RoleSelectionGateway.name);

    constructor(
        private readonly roleSelectionService: RoleSelectionService
    ) {}

    @Once('ready')
    async onReady() {
        this.roleSelectionService.initRoleSelection();
    }

    @UseGuards(ChannelGuard(process.env.DISC_ROLE_SELECTION_CHANNEL))
    @On('messageReactionAdd')
    async onReact(msg: MessageReaction, user: ClientUser): Promise<void> {
        if (!user.bot){
            this.roleSelectionService.handleRoleMutation(msg, user, 'add');
        }
    }

    @On('messageReactionRemove')
    async onRemove(msg: MessageReaction, user: ClientUser): Promise<void> {
        if (!user.bot){
            this.roleSelectionService.handleRoleMutation(msg, user, 'remove');
        }
    }
}
