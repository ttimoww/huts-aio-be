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
import Twit from 'twit';

@Injectable()
export class SuccessService {
    private logger = new Logger('SuccessService');

    constructor(private readonly twit: Twit){}

    async handleSuccessPost(msg: Message): Promise<void>{
        try {
            // eslint-disable-next-line no-useless-escape
            const twitterRegex = new RegExp(/(https\:\/\/twitter\.com\/)/, '');

            if (msg.attachments.size){
                await this.handleImage(msg);
            } else if (msg.content.match(twitterRegex)){
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
        
        const tweetIdRegex = new RegExp(/(?:(?:\/status\/)([0-9]+))/, '');
        const tweetId = msg.content.match(tweetIdRegex);

        // Invalid Tweet link
        if (!tweetId) {
            msg.reply('Invalid tweet link');
            return;
        }

        // Handle Tweet
        this.twit.get('statuses/show/:id', { id: tweetId[1] }, (err, data: any, resp) => {   
            if (data.entities?.user_mentions && data.entities?.media){
                const tagged = data.entities.user_mentions.some(tag => tag.screen_name === 'HutsAIO' || tag.screen_name === 'HutsSuccess');
                if (!tagged){
                    msg.reply('Pls tag us');
                    return;
                }

                // this.twit.post('statuses/retweet/:id', { id: tweetId[1] })

                msg.reply('Thx for posting success');
            }else{
                console.log('NOT GOOD');
            }
        });
    }
}