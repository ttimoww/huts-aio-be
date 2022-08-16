// NestJS
import { Injectable, Logger,  } from '@nestjs/common';

// Discord
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, ClientUser, Guild, Message, EmbedBuilder, MessageReaction, Role, TextChannel } from 'discord.js';

// Config
import * as config from 'config';
const webhookStyles = config.get('webhookStyles');
const roles = config.get('reactionRoles');

@Injectable()
export class RoleSelectionService {
    private logger = new Logger('RoleSelectionService');
    private MESSAGE_ID = 'CustomRoleSelectionId';

    constructor(
        @InjectDiscordClient()
        private readonly discordClient: Client,
    ){}

    /**
     * Creates the embed with all reaction roles
     * @returns The embed
     */
    private createEmbed(): EmbedBuilder{
        const embed = new EmbedBuilder()
            .setColor(webhookStyles.color)
            .setTitle('Role Selection')
            .setDescription('React below to receive your role\n\n')
            .setTimestamp()
            .setThumbnail(webhookStyles.icon)
            .setFooter({ text: 'HutsAIO', iconURL: `${webhookStyles.icon}?roleselection=${this.MESSAGE_ID}` });
    
        roles.forEach(r => {
            embed.setDescription(embed.data.description + `${r.roleEmoji} - ${r.roleName} \n`);
        });    

        // Add an hidden character for some extra spacing
        embed.setDescription(embed.data.description + '‎');

        return embed;
    }

    /**
     * Finds a role by name (ignores uppercase/lowercase)
     * @param name The name of the role to find
     * @param guild The server to find the role in
     * @returns The role
     */
    private async findRole(name: string, guild: Guild): Promise<Role>{    
        return await guild.roles.cache.find(r => r.name.toLowerCase() === name.toLowerCase());
    }

    /**
     * Fetches all messages from the role selection channel and finds the right embed
     * using the MESSAGE_ID thats hidden in the footer icon URL. On every startup sync this message
     * with the roles array.
     * 
     * If no message is found, it creates a new one.
     */
    public async initRoleSelection(): Promise<void>{
        if (!process.env.DISC_ROLE_SELECTION_CHANNEL){
            this.logger.warn('No role selection channel ID found');
            return;
        }
        
        const channel = this.discordClient.channels.cache.get(process.env.DISC_ROLE_SELECTION_CHANNEL) as TextChannel;
        let roleSelectionMessage: Message;

        /**
         * Create the Embed
         */
        const embed = this.createEmbed();
        try {
            const messages = await channel.messages.fetch();
            roleSelectionMessage = messages.find(m => m.embeds[0].footer.iconURL.includes(this.MESSAGE_ID));

            await roleSelectionMessage.edit({ embeds: [embed] });
            this.logger.log('Updated role selection embed');

        } catch (error) {
            roleSelectionMessage = await channel.send({ embeds: [embed] });
            this.logger.log('Created new role selection embed');
        } 

        /**
         * Add reactions
         */
        roles.forEach(async r => await roleSelectionMessage.react(r.roleEmoji));
    }

    /**
     * Add or Remove a role based on the reacted emoji
     * @param msg The original message
     * @param user The reactor
     * @param action Add or Remove the role
     */
    public async handleRoleMutation(msg: MessageReaction, user: ClientUser,  action: 'add' | 'remove'): Promise<void>{
        try {
            const theRole = roles.find(r => r.roleEmoji === msg.emoji.name);
        
            let role = await this.findRole(theRole.roleName, msg.message.guild);
            if (!role) {
                role = await msg.message.guild.roles.create({ name: theRole.roleName.toLowerCase(), color: '#ecf0f1' });
                this.logger.verbose(`Created new role: ${theRole.roleName.toLowerCase()}`);
            }

            const member = await msg.message.guild.members.cache.find(m => m.id === user.id);

            if (action === 'add') member.roles.add(role);
            else await member.roles.remove(role);       
        } catch (error) {
            this.logger.error(`Unable to ${action} remove role from ${user.tag}`, error);
        }
    }
}
