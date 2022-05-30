import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient, UseGuards } from '@discord-nestjs/core';
import { Client, Message } from 'discord.js';
import { StaffOnlyGuard } from './guards/staff-only.guard';

@Injectable()
export class BotGateway {
    private readonly logger = new Logger(BotGateway.name);

    constructor(
        @InjectDiscordClient()
        private readonly client: Client,
    ) {}

  @Once('ready')
    onReady() {
        this.logger.log(`Bot ${this.client.user.tag} was started!`);
    }
  
    @UseGuards(StaffOnlyGuard)
    @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
      if (!message.author.bot) {
          await message.reply('I\'m watching you');
      }
  }
}
