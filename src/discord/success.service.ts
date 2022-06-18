// NestJS Dependencies
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
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
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SuccessService {
    private logger = new Logger('SuccessService');

    constructor(
        private readonly twit: Twit,
        private readonly httpService: HttpService
    ){}

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

        const attachments = msg.attachments.map(att => att.url);

        /**
         * Get the imageBuffer
         */
        const { data: imageBuffer } = await lastValueFrom(
            this.httpService.get(attachments[0], { responseType: 'arraybuffer' })
                .pipe(map(resp => resp))
        );

        /**
         * Update media to Twitter
         */
        const mediaResp = await this.twit.post('media/upload', { 
            media_data: Buffer.from(imageBuffer).toString('base64') 
        });
        const tweetMedia = mediaResp.data as any;

        /**
         * Tweet
         */
        const tweetResp = await this.twit.post('statuses/update', {
            status: `Success posted in HutsAIO by ${msg.author.tag}` + (msg.content? ' | '+msg.content: ''),
            media_ids: [tweetMedia.media_id_string]
        });
        const tweet = tweetResp.data as any;

        const embed = new MessageEmbed()
            .setColor('#6366F1')
            .setTitle('Your tweet was posted! React with :wastebasket: to delete')
            .setDescription('We\'ve added 1 succespoint to your account.')
            .setTimestamp()
            .setFooter({ text: 'HutsAIO', iconURL: `https://i.imgur.com/cXu8bLX.png?author=${msg.member.id}&tweetId=${tweet.id_str}` });
                
        msg.channel.send({ embeds: [embed] }).then(msg => msg.react('🗑'));
    }
    
    private async handleTweet(msg: Message){        
        const tweetIdRegex = new RegExp(/(?:(?:\/status\/)([0-9]+))/, '');
        const tweetId = msg.content.match(tweetIdRegex);

        if (!tweetId) {
            const embed = new MessageEmbed()
                .setColor('#6366F1')
                .setTitle('Invalid tweet')
                .setDescription('Please double check the provided link!')
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });
                
            msg.channel.send({ embeds: [embed] });
            return;
        }

        this.twit.get('statuses/show/:id', { id: tweetId[1] }, (err, data: any, resp) => {   
            
            /**
             * Tweet should contain at least one tag and one media item
             */
            if (!data.entities?.user_mentions || !data.entities?.media) return;

            const tagged = data.entities.user_mentions.some(tag => tag.screen_name === 'HutsAIO' || tag.screen_name === 'HutsSuccess');
            if (!tagged){
                const embed = new MessageEmbed()
                    .setColor('#6366F1')
                    .setTitle('Your tweet doesn\'t tag us')
                    .setDescription('Make sure to tag @HutsAIO when posting your success!')
                    .setTimestamp()
                    .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });
                
                msg.channel.send({ embeds: [embed] });
                return;
            }

            // this.twit.post('statuses/retweet/:id', { id: tweetId[1] })

            const embed = new MessageEmbed()
                .setColor('#6366F1')
                .setTitle('Thank you for tweeting your success')
                .setDescription('We\'ve added 2 succespoints to your account.')
                .setTimestamp()
                .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });

            msg.channel.send({ embeds: [embed] })
                .then(msg => {
                    msg.react('🗑');
                });
        });
    }
}