// NestJS Dependencies
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

// Discord
import { Client, Message, MessageEmbed, TextChannel, WebhookClient } from 'discord.js';

// Dto
import { CheckoutDto } from 'src/checkout/checkout.dto';
import { WebhookDto } from './dto/webhook.dto';

// Entities
import { User } from 'src/user/entities/user.entity';
import { Webhook } from './entities/webhook.entity';

@Injectable()
export class SuccessService {
    private logger = new Logger('SuccessService');

    async handleSuccessPost(msg: Message): Promise<void>{
        try {
            // eslint-disable-next-line no-useless-escape
            const twitterRegex = new RegExp(/(https\:\/\/twitter\.com\/)/, '');
            const tweetRegex = new RegExp(/(?:(?:\/status\/)([0-9]+))/, '');

            if (msg.attachments.size){
                await this.handleImage(msg);
            } else if (msg.content.match(twitterRegex) && msg.content.match(tweetRegex)){
                await this.handleTweet(msg);
            }
        } catch (err) {
            this.logger.error('Unable to process success post', err);
            msg.reply('Sorry, something went wrong while processing your post (<@359071634453299201>)');
        }
    }

    private async handleImage(msg: Message){
        this.logger.verbose('handle image');
    }
    
    private async handleTweet(msg: Message){
        this.logger.verbose('handle tweet');
        
        /**
         * Check if it is a tweet url (using 'status')
         * Find @HutsAIO tag
         * Add points
         * Reply
         */
    }
}