import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

// Discord
import { ClientUser, Message, MessageEmbed, MessageReaction } from 'discord.js';

// Packages
import Twit from 'twit';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

// Services
import { UserService } from 'src/user/user.service';

@Injectable()
export class SuccessService {
    private logger = new Logger('SuccessService');

    constructor(
        private readonly twit: Twit,
        private readonly httpService: HttpService,
        private readonly userService: UserService
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

    /**
     * Tweet a success image and award 1 success point
     * @param msg The Discord message
     */
    private async handleImage(msg: Message){
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

        const successPoints = await this.userService.mutateSuccessPoints(msg.author.id, 'add', 1);

        const embed = new MessageEmbed()
            .setColor('#6366F1')
            .setTitle('Your tweet was posted! React with :wastebasket: to delete')
            .setDescription(`We've added 1 succes point to your account, you now have a total of ${successPoints} points.`)
            .setTimestamp()
            .setFooter({ text: 'HutsAIO', iconURL: `https://i.imgur.com/cXu8bLX.png?author=${msg.member.id}&tweetId=${tweet.id_str}` });
                
        msg.channel.send({ embeds: [embed] }).then(msg => msg.react('🗑'));
        this.logger.verbose(`${msg.author.tag} posted a success image`);
    }
    
    /**
     * Retweet a success tweet and award 2 success points. 
     * Tweet has to match the following requirements:
     * - Contain media
     * - Tag HutsAIO or HutsSuccess
     * @param msg The Discord message
     */
    private async handleTweet(msg: Message): Promise<void>{        
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

        const resp = await this.twit.get('statuses/show/:id', { id: tweetId[1] });
        const tweet = resp.data as any;

        /**
         * Tweet should contain at least one tag and one media item
         */
        if (!tweet.entities?.user_mentions || !tweet.entities?.media) return;

        const tagged = tweet.entities.user_mentions.some(tag => tag.screen_name === 'HutsAIO' || tag.screen_name === 'HutsSuccess');
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

        await this.twit.post('statuses/retweet/:id', { id: tweetId[1] });

        const successPoints = await this.userService.mutateSuccessPoints(msg.author.tag, 'add', 2);

        const embed = new MessageEmbed()
            .setColor('#6366F1')
            .setTitle('Thank you for tweeting your success')
            .setDescription(`We've added 2 succes points to your account, you now have a total of ${successPoints} points.`)
            .setTimestamp()
            .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });

        msg.channel.send({ embeds: [embed] });
        this.logger.verbose(`${msg.author.tag} posted a success tweet`);
    }

    /**
     * Remove a tweet and substract a point
     * @param msg The MessageReaction
     * @param user The user who perfomed the reaction
     */
    async removeTweet(msg: MessageReaction, user: ClientUser): Promise<void>{
        if (!msg.message.embeds.length) return;

        const urlData = msg.message.embeds[0].footer.iconURL;
        const msgOwner = urlData.match(/(?:(?:author\=)([0-9]+))/i)[1];
        const tweetId = urlData.match(/(?:(?:tweetId\=)([0-9]+))/i)[1];
    
        if (msgOwner !== user.id) return;

        await this.twit.post('statuses/destroy/:id', { id: tweetId });
        const successPoints = await this.userService.mutateSuccessPoints(user.id, 'substract', 1);

        const embed = new MessageEmbed()
            .setColor('#6366F1')
            .setTitle('Your tweet was deleted!')
            .setDescription(`You now have a total of ${successPoints} points.`)
            .setTimestamp()
            .setFooter({ text: 'HutsAIO', iconURL: 'https://i.imgur.com/cXu8bLX.png' });
               
        msg.message.edit({ embeds: [embed] });
        this.logger.verbose(`${user.tag} deleted his success image`);

    }
}